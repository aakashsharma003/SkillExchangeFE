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
  updateChats: any;
}) {
  const { user, chatRoomId, offeredSkill, requestedSkill } = chat;
  const currentUser = useUser().user;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getChat(chatRoomId);

        if (!res.success) {
          setLoading(false);
          return toast.error(res.message);
        }

        setLoading(false);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        toast.error('something went wrong. unable to fetch messages');
        setLoading(false);
      }
    })();
  }, [chat.chatRoomId]);

  const clientRef = useRef<any>(null);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      debug: str => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/messages/${chatRoomId}`, message => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
        updateChats(chatRoomId);
      });
    };

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [chatRoomId]);

  // Function to send message
  const sendMessage = (message: string) => {
    if (message === '') return;

    if (clientRef.current && clientRef.current.connected) {
      const msg = {
        senderId: currentUser.id,
        receiverId: user.id,
        message,
        chatRoomId,
      };

      clientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(msg),
      });
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const last_message_timestamp = messages[messages.length - 1].createdAt;

    localStorage.setItem(chatRoomId, last_message_timestamp);
  }, [messages]);

  return (
    <div className='flex flex-1 flex-col'>
      <div className='p-5 border-b-[1px] border-[#ddd] border-solid flex justify-between items-center bg-white'>
        <div>
          <h2>Chat with {user.name}</h2>
          <h3>
            You learn
            <span className='font-semibold'> {requestedSkill} </span>
            and teach <span className='font-semibold'>{offeredSkill}</span>
          </h3>
        </div>
        <button className='px-5 py-2 bg-[#3b82f6] text-white border-none rounded-sm cursor-pointer'>
          Start Video Call
        </button>
      </div>

      {/* Chat Messages */}
      <div
        className='flex-1 p-5 flex flex-col gap-4 bg-[#f0f2f5] overflow-auto'
        ref={containerRef}
      >
        {loading ? (
          <div className='flex h-full flex-col justify-end gap-4'>
            <div className='rect skeleton-content bg-[#dbeafe]'></div>
            <div className='rect skeleton-content self-end bg-[#d1fae5]'></div>
            <div className='rect skeleton-content bg-[#dbeafe]'></div>
            <div className='rect skeleton-content self-end bg-[#d1fae5]'></div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className='flex'
              style={{
                justifyContent:
                  msg.senderId !== user.id ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                className='px-4 py-2 rounded-[10px] text-base max-w-[60%]'
                style={{
                  backgroundColor:
                    msg.senderId !== user.id ? '#d1fae5' : '#dbeafe',
                }}
              >
                <div>{msg.message}</div>

                <div className='text-[10px] text-gray-600 text-right italic'>
                  {formatTimeAgo(msg.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='flex p-4 border-t-[1px] border-[#ddd] bg-white'>
        <input
          type='text'
          placeholder='Type your message...'
          value={newMessage}
          onChange={({ target }) => setNewMessage(target.value)}
          className='flex-1 p-2 border-[1px] border-[#ccc] rounded-sm mr-2'
        />
        <button
          onClick={() => {
            sendMessage(newMessage);
          }}
          className='px-5 py-2 bg-[#3b82f6] border-none text-white cursor-pointer rounded-sm'
        >
          Send
        </button>
      </div>
    </div>
  );
}
