import { getUserProfile } from '@/api/user';
import appRoutes from '@/routes/appRoutes';
import { User } from '@/types/user';
import { useState } from 'react';
import toast from 'react-hot-toast';

const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await getUserProfile();

      if (!res.success) {
        toast.error(res.message);
        return logout();
      }

      setUser(res.data);
    } catch (error: any) {
      toast.error('something went wrong. failed to fetch user profile.');
      logout();
    }
  };

  // Function to logout
  const logout = async () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setUser(null);

    window.location.pathname = appRoutes.login;
  };

  return {
    user,
    setUser,
    fetchUser,
    logout,
  };
};

export default useAuthProvider;
