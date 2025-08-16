import { IexchangeRequestFormData } from '@/types/swal-request';
import { api } from './auth';

export const requestSkillExchange = async (payload: IexchangeRequestFormData) => {
  const token = localStorage.getItem('token');

  const response = await api.post('/skill-exchange/request', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchSentRequests = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/skill-exchange/sent-requests', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchReceivedRequests = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/skill-exchange/received-requests', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const acceptRequest = async (id: string, offeredSkill: string) => {
  const token = localStorage.getItem('token');

  const response = await api.put(
    `/skill-exchange/update-request/${id}`,
    { status: true, offeredSkill },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const rejectRequest = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await api.put(
    `/skill-exchange/update-request/${id}`,
    { status: false },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};
