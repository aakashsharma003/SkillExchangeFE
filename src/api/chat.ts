import { ICreateChatFormData } from '@/types/chat';
import { api } from './auth';

// create Chat Room
export const createChatRoom = async (payload: ICreateChatFormData) => {
  const token = localStorage.getItem('token');

  const response = await api.post('/chat/rooms', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Get All Chats
export const getChats = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await api.get(`chat/rooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Get Chat
export const getChat = async (chatRoomId: string) => {
  const token = localStorage.getItem('token');
  console.log("this is the chatroomid",chatRoomId);
  const response = await api.get(`chat/rooms/${chatRoomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
    console.log("these are messages",response.data);
  return response.data;
};
