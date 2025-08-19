import { getChats } from '@/api/chat';
import ChatRoom from '@/components/Chat/ChatRoom';
import Sidebar from '@/components/Chat/Sidebar';
import { useUser } from '@/context/auth/useUser';
import { IChat, IMessage } from '@/types/chat';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/api/auth';
import { Separator } from '@/components/ui/separator';

const WEBSOCKET_URL = BASE_URL + '/ws-chat';

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  const { id } = useUser().user;
  const [chats, setChats] = useState<IChat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setChatsLoading(true);
        const res = await getChats(id);

        if (!res.success) return toast.error(res.message);

        setChats(res.data);
        setChatsLoading(false);
        if (res.data.length !== 0) setSelectedChat(res.data[0]);
      } catch (err) {
        console.log(err);
        toast.error('something went wrong. unable to fetch all chats');
        setChatsLoading(false);
      }
    })();
  }, []);
  const onSelect = (chat: IChat) => setSelectedChat(chat);

  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (!chats) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      debug: str => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/user/${id}`, message => {
        const receivedMessage: IMessage = JSON.parse(message.body);
        updateChats(receivedMessage.chatRoomId);
      });
    };

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [chats]);

  const updateChats = (chatRoomId: string) => {
    const updated = chats.find(chat => chat.chatRoomId === chatRoomId);
    if (!updated) return;

    // If the chat is already at the top, do nothing
    if (chats[0].chatRoomId === chatRoomId) return;

    const reorderedChats = [
      updated,
      ...chats.filter(chat => chat.chatRoomId !== chatRoomId),
    ];

    setChats(reorderedChats);
  };

  if (!chatsLoading && chats.length === 0)
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <div className='rounded-2xl border bg-card p-10 text-center'>
          <h1 className='text-2xl font-semibold'>No chats yet</h1>
          <p className='mt-2 text-sm text-muted-foreground'>Make some exchange requests to access Chats.</p>
        </div>
      </div>
    );

  return (
    <div className='flex h-screen bg-background'>
      <Sidebar chats={chats} loading={chatsLoading} onSelect={onSelect} />
      <Separator orientation='vertical' />
      {chatsLoading || selectedChat === null ? (
        <div className='flex w-full items-center justify-center'>
          <Loader2 className='h-10 w-10 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <ChatRoom chat={selectedChat} updateChats={updateChats} />
      )}
    </div>
  );
};

export default Chat;