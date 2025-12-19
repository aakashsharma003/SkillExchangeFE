import { getChat } from '@/api/chat';
import { IChat, IMessage } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/api/auth';
import { useUser } from '@/context/auth/useUser';
import { formatTimeAgo } from '@/utils/date';

const WEBSOCKET_URL = BASE_URL + '/ws-chat';

export default function ChatRoom({
  chat,
  updateChats,
}: {
  chat: IChat;
  updateChats: (chatRoomId: string) => void;
}) {
  /** * 1. UNIVERSAL ID HANDLING
   * Backend might send 'id', 'chatroomId', or 'chatRoomId'.
   * This logic ensures we always have a valid Room ID.
   */
  const actualRoomId = chat.chatRoomId || (chat as any).chatroomId || (chat as any).id;
  const { otherUser, offeredSkill, requestedSkill } = chat;
  const currentUser = useUser().user;

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  // Auto-scroll to the latest message whenever the messages array updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * 2. REST API: FETCH MESSAGE HISTORY
   * Fetches existing messages from MongoDB using the actualRoomId.
   */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!actualRoomId) return;
      try {
        setLoading(true);
        const res = await getChat(actualRoomId);
        if (res.success) {
          setMessages(res.data);
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [actualRoomId]);

  /**
   * 3. WEBSOCKET: REAL-TIME MESSAGING
   * Connects to the server and subscribes to the specific room's topic.
   */
  useEffect(() => {
    if (!actualRoomId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP: Connected to Room:', actualRoomId);

        // Listen for incoming messages on the specific room topic
        stompClient.subscribe(`/topic/room/${actualRoomId}`, (payload) => {
          const receivedMessage = JSON.parse(payload.body);

          setMessages((prev) => {
            // Prevent duplicate messages in the UI
            if (prev.find((m) => m.id === receivedMessage.id)) return prev;
            return [...prev, receivedMessage];
          });

          // Updates the order of chats in the sidebar
          updateChats(actualRoomId);
        });
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    /** * CLEANUP: Close the socket when component unmounts or room changes.
     * Prevents "WebSocket is closed before established" errors.
     */
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [actualRoomId, updateChats]);

  /**
   * 4. SEND MESSAGE FUNCTION
   * Publishes the message to the backend via the STOMP client.
   */
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !actualRoomId) return;

    if (clientRef.current?.connected) {
      const msgPayload = {
        senderId: currentUser.id,
        receiverId: otherUser.id,
        content: newMessage, // Matches 'content' field in Backend Entity
        chatRoomId: actualRoomId,
      };

      clientRef.current.publish({
        destination: '/app/chat.send', // Backend @MessageMapping("/chat.send")
        body: JSON.stringify(msgPayload),
      });

      setNewMessage('');
    } else {
      toast.error("Connecting to server...");
    }
  };

  return (
    <div className='flex flex-1 flex-col h-full bg-white'>
      {/* Header with User Info */}
      <div className='p-5 border-b border-gray-200 flex justify-between items-center bg-white'>
        <div>
          <h2 className='text-lg font-bold'>Chat with {otherUser?.fullName}</h2>
          <p className='text-sm text-gray-500'>
            Learning <span className='font-semibold text-blue-600'>{requestedSkill}</span> |
            Teaching <span className='font-semibold text-green-600'>{offeredSkill}</span>
          </p>
        </div>
      </div>

      {/* Messages Scrollable Container */}
      <div
        className='flex-1 p-5 flex flex-col gap-3 bg-gray-50 overflow-y-auto'
        ref={containerRef}
      >
        {loading ? (
          <div className="text-center text-gray-400 mt-10">Syncing messages...</div>
        ) : (
          // Inside messages.map in ChatRoom.tsx
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const textContent = (msg as any).content || (msg as any).message;

            /**
             * WHATSAPP STYLE TIME DISPLAY
             * This calls our improved utility function.
             */
            const displayTime = () => {
              if (!msg.createdAt) return 'Just now';

              // Convert string timestamp to Date object first
              const dateObj = new Date(msg.createdAt);

              // Final check before sending to utility
              return isNaN(dateObj.getTime()) ? 'Just now' : formatTimeAgo(dateObj);
            };

            return (
              <div key={msg.id || Math.random()} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border'
                  }`}>
                  <p className='text-sm leading-relaxed'>{textContent}</p>
                  <p className={`text-[10px] mt-1 text-right opacity-70`}>
                    {displayTime()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Bar */}
      <div className='p-4 border-t border-gray-200 bg-white flex gap-2'>
        <input
          type='text'
          placeholder='Type a message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={handleSendMessage}
          className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all active:scale-95'
        >
          Send
        </button>
      </div>
    </div>
  );
}