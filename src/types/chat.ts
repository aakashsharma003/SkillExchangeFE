import { User } from './user';

export type ICreateChatFormData = {
  user1Id: string;
  user2Id: string;
  exchangeRequestId: string;
};

export type IChat = {
  chatRoomId: string; // The ChatRoom ID
  otherUser: User;
  offeredSkill: string;
  requestedSkill: string;
  lastActivityAt?: string;
  exchangeRequestId?: string;
};

export type IMessage = {
  chatRoomId: string;
  id: string;
  senderId: string;
  senderEmail?: string;
  content: string;
  createdAt: string;
  /** Call-related fields */
  messageType?: 'TEXT' | 'CALL_STARTED' | 'CALL_ENDED' | 'RECORDING';
  callRecordId?: string;
  recordingUrl?: string;
  callDurationSeconds?: number;
};
