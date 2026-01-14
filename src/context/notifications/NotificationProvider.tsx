import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWebSocket, Notification } from '@/hooks/useWebSocket';
import { useUser } from '@/context/auth/useUser';

interface NotificationContextType {
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useUser();
  const notifications: Notification[] = []; // Can be enhanced to store notifications

  // Connect to WebSocket for notifications
  useWebSocket({
    userId: user?.id || '',
    onNotification: (notification) => {
      console.log('Received notification:', notification);
      // Handle notification (e.g., add to notifications array, update state)
    },
  });

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
