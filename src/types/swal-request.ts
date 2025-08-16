import { User } from './user';

export type IRequest = {
  id: string;
  senderID: string;
  offeredSkill: string;
  requestedSkill: string;
  receiverID: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type IexchangeRequest = {
  senderDetails: User;
  receiverDetails: User;
  request: IRequest;
};

export type IexchangeRequestFormData = {
  receiverID: string;
  requestedSkill: string;
  message: string;
};
