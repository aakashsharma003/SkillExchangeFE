import { User } from './user';

export type IRequest = {
  id: string;
  senderID: string;
  offeredSkill: string;
  requestedSkill: string;
  receiverId: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type IexchangeRequest = {
  id: string;
  requestedSkill: string;
  offeredSkill: string | null;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sender: User;      // Matches "sender" in your JSON
  receiver: User;    // Matches "receiver" in your JSON
  createdAt: string;
  updatedAt: string;
};
export type IexchangeRequestFormData = {
  receiverId: string;
  requestedSkill: string;
  message: string;
};
