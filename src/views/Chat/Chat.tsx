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
import { User } from '@/types/user';

const WEBSOCKET_URL = BASE_URL + '/ws-chat';

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(0);
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
      <div className='h-screen bg-white flex items-center justify-center'>
        <h1 className='text-2xl font-semibold text-center'>
          No chats found.
          <br /> Make some exchange requests to access Chats
        </h1>
      </div>
    );

  return (
    <div
      style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f7fa' }}
    >
      <Sidebar chats={chats} loading={chatsLoading} onSelect={onSelect} />

      {chatsLoading || selectedChat === null ? (
        <div className='w-full flex justify-center items-center'>
          <Loader2 className='h-12 w-12 animate-spin' />
        </div>
      ) : (
        <ChatRoom chat={selectedChat} updateChats={updateChats} />
      )}
    </div>
  );
};

export default Chat;
