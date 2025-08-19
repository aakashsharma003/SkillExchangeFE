import { getChat } from '@/api/chat';
import { IChat, IMessage } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/api/auth';
import { useUser } from '@/context/auth/useUser';
import { formatTimeAgo } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Phone } from 'lucide-react';

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
    <div className='flex flex-1 flex-col bg-background'>
      <div className='flex items-center justify-between border-b bg-card px-5 py-4'>
        <div className='flex items-center gap-3'>
          <Avatar fallback={user.name.split(' ')[0]?.[0]} />
          <div>
            <h2 className='text-sm font-semibold leading-tight'>Chat with {user.name}</h2>
            <h3 className='text-xs text-muted-foreground'>
              You learn <span className='font-semibold'>{requestedSkill}</span> and teach <span className='font-semibold'>{offeredSkill}</span>
            </h3>
          </div>
        </div>
        <Button variant='secondary' className='gap-2'>
          <Phone className='h-4 w-4' />
          Start call
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className='flex-1'>
        <div className='flex min-h-full flex-col gap-3 bg-transparent p-5' ref={containerRef}>
          {loading ? (
            <div className='flex h-full flex-col justify-end gap-4'>
              <div className='rect skeleton-content bg-muted'></div>
              <div className='rect skeleton-content self-end bg-muted'></div>
              <div className='rect skeleton-content bg-muted'></div>
              <div className='rect skeleton-content self-end bg-muted'></div>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId !== user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm transition ${
                      isMe
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div>{msg.message}</div>
                    <div className='mt-1 text-[10px] italic text-muted-foreground'>{formatTimeAgo(msg.createdAt)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <Separator />
      <div className='flex items-center gap-2 bg-card px-4 py-3'>
        <Input
          placeholder='Type your message…'
          value={newMessage}
          onChange={({ target }) => setNewMessage(target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') sendMessage(newMessage);
          }}
          className='flex-1'
        />
        <Button
          onClick={() => {
            sendMessage(newMessage);
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
