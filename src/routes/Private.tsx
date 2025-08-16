import { useAuth } from '@/context/auth/useAuth';
import AppLoading from '@/views/AppLoading/AppLoading';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import appRoutes from './appRoutes';

const Private = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      const logged_in_once = localStorage.getItem('logged_in_once');

      if (!logged_in_once) navigate('/', { replace: true });
      else navigate(appRoutes.login, { replace: true });
    }

    if (!user) fetchUser();
  }, []);

  return user ? <Outlet /> : <AppLoading />;
};

export default Private;
