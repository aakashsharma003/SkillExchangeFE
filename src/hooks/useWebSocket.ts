import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from '@/api/auth';
import toast from 'react-hot-toast';

// WebSocket URL for notifications - convert HTTP/HTTPS to WS/WSS
const getWebSocketUrl = () => {
  let baseUrl = import.meta.env.VITE_APP_BASE_URL;
  if (baseUrl.startsWith('https://')) {
    baseUrl = baseUrl.replace('https://', 'wss://');
  } else if (baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'ws://');
  }
  return baseUrl + "/api/ws-notifications";
};

const WEBSOCKET_URL = getWebSocketUrl();

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
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log("Notification WS:", str),
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
        console.error('Notification STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('Notification WebSocket error:', event);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      try {
        if (stompClient.active) {
          stompClient.deactivate();
        }
      } catch (error) {
        console.error('Error deactivating notification WebSocket:', error);
      }
    };
  }, [userId, onNotification]);

  return clientRef.current;
}
