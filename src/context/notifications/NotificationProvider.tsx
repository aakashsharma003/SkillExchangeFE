import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useWebSocket, Notification } from '@/hooks/useWebSocket';
import { useAuth } from '@/context/auth/useAuth';

interface NotificationContextType {
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Connect to WebSocket for notifications only if user is loaded
  useWebSocket({
    userId: user?.id || '',
    onNotification: (notification) => {
      console.log('Received notification:', notification);
      // Add notification to state
      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
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
