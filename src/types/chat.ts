import { User } from './user';

export type ICreateChatFormData = {
  user1Id: string;
  user2Id: string;
  exchangeRequestId: string;
};

export type IChat = {
  chatRoomId: string;
  user: User;
  offeredSkill: string;
  requestedSkill: string;
};

export type IMessage = {
  chatRoomId: string;
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};
