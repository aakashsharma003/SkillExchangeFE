import { IexchangeRequestFormData } from '@/types/swal-request';
import { api } from './auth';

export const requestSkillExchange = async (payload: IexchangeRequestFormData) => {
  const token = localStorage.getItem('token');

  const response = await api.post('/exchange-requests', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchSentRequests = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/exchange-requests/sent', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchReceivedRequests = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/exchange-requests/received', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const acceptRequest = async (id: string, offeredSkill: string) => {
  const token = localStorage.getItem('token');

  const response = await api.put(
    `/exchange-requests/${id}`,
    { accepted: true, offeredSkill },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

export const rejectRequest = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await api.put(
    `/exchange-requests/${id}`,
    { status: false },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};
