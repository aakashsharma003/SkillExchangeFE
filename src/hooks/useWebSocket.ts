import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/api/auth';
import toast from 'react-hot-toast';

const WEBSOCKET_URL = BASE_URL.replace('/api', '') + '/ws-chat';

export interface Notification {
  type: string;
  title: string;
  message: string;
  userId: string;
  timestamp?: number;
}

interface UseWebSocketOptions {
  userId: string;
  onNotification?: (notification: Notification) => void;
}

/**
 * Custom hook for WebSocket notifications
 * Subscribes to /user/{userId}/queue/notifications
 */
export function useWebSocket({ userId, onNotification }: UseWebSocketOptions) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected for notifications');
        
        // Subscribe to user-specific notifications
        stompClient.subscribe(`/user/${userId}/queue/notifications`, (payload) => {
          try {
            const notification: Notification = JSON.parse(payload.body);
            
            // Show toast notification
            toast.success(notification.message || notification.title, {
              duration: 5000,
            });
            
            // Call custom handler if provided
            if (onNotification) {
              onNotification(notification);
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [userId, onNotification]);

  return clientRef.current;
}
