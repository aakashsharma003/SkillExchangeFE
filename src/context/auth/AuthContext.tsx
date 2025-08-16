import { createContext, ReactNode } from 'react';
import useAuthProvider from './useAuthProvider';
import { AuthContextType } from './types';

export const authContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useAuthProvider();

  return (
    <authContext.Provider value={contextValue}>{children}</authContext.Provider>
  );
};

export default AuthProvider;
