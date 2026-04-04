import { api } from './auth';
import { withCache } from '@/utils/cache';

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
  skillsMastered?: number;
  dailyGoalProgress?: number;
  skillTrends?: Array<{
    month: string;
    beginner: number;
    intermediate: number;
    advanced: number;
  }>;
  localExperts?: Array<{
    lat: number;
    lng: number;
    skill: string;
    count: number;
    location: string;
  }>;
}

export const getDashboardStats = (): Promise<DashboardStats> => {
  return withCache('dashboard-stats', async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  }, 60_000);
};
