import { ICreateChatFormData } from '@/types/chat';
import { api } from './auth';

// create Chat Room
export const createChatRoom = async (payload: ICreateChatFormData) => {
  const token = localStorage.getItem('token');

  const response = await api.post('/chat/create-chat-room', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Get All Chats
export const getChats = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await api.get('chat/rooms/' + id, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Get Chat
export const getChat = async (chatRoomId: string) => {
  const token = localStorage.getItem('token');

  const response = await api.get(`/chat/room/messages`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { chatRoomId },
  });

  return response.data;
};
