import { IUpdateUser } from '@/types/user';
import { api } from './auth';

// Get user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Update user details
export const updateDetails = async (data: IUpdateUser) => {
  const token = localStorage.getItem('token');

  const response = await api.put('/users/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// 🔧 Fix: Add headers to search-user to avoid CORS issues
export const searchUser = async (skill: string) => {
  const token = localStorage.getItem('token');

  const response = await api.get(`/users/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { skill },
  });

  return response.data;
};

// Fetch other user profile
export const fetchUserProfile = async (email: string) => {
  const token = localStorage.getItem('token');

  const response = await api.get(`/users/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { email },
  });

  return response.data;
};

// Delete user account
export const deleteAccount = async () => {
  const token = localStorage.getItem('token');

  const response = await api.delete('/users/delete-account', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Report suspicious activity
export const reportSuspiciousActivity = async (data: {
  description: string;
  relatedUser: string | null;
}) => {
  const token = localStorage.getItem('token');

  const response = await api.post('/users/report-activity', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
