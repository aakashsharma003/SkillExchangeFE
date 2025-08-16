import { useContext } from 'react';
import { authContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(authContext);

  if (context === null) {
    throw new Error('Auth state has not been configured, value is null');
  } else if (context === undefined) {
    throw new Error('useAuth was used outside of its Provider');
  }

  return context;
};
