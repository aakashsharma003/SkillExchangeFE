import { api } from './auth';

export interface DashboardStats {
  totalConnections: number;
  skillsExchanged: number;
  badgesEarned: number;
  activeSessions: number;
  recentConnections: Array<{
    userId: string;
    name: string;
    skill: string;
    timeAgo: string;
  }>;
  weekChange: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const token = localStorage.getItem('token');
  const response = await api.get('/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};
