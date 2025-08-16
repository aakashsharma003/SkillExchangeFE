import { User } from '@/types/user';

export type AuthContextType = {
  user: User | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
};
