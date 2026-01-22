import { getUserProfile } from '@/api/user';
import appRoutes from '@/routes/appRoutes';
import { User } from '@/types/user';
import { useState } from 'react';
import toast from 'react-hot-toast';

const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      console.log("hii here aim ")
      const res = await getUserProfile();
      console.log("response",res);
      if (!res.success) {
        toast.error(res.message);
        return logout();
      }
      
      setUser(res.data);
    } catch (error: any) {
      console.log("this is the error occured",error)
      toast.error('something went wrong. failed to fetch user profile.');
      logout();
    }
  };

  // Function to logout
  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('logged_in_once');
    sessionStorage.clear();
    setUser(null);

    window.location.pathname = appRoutes.root;
  };

  return {
    user,
    setUser,
    fetchUser,
    logout,
  };
};

export default useAuthProvider;
