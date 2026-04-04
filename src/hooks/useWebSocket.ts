import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

// WebSocket URL for notifications - SockJS requires HTTP/HTTPS, not WS/WSS
// SockJS will handle the WebSocket protocol negotiation internally
const getWebSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  // SockJS needs the HTTP/HTTPS URL, not WS/WSS
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
            
              const typeStr = (notification.type || "").toUpperCase();
              const state = (typeStr.includes("EXCHANGE") || typeStr.includes("REQUEST") || typeStr.includes("MATCH")) 
                ? "alert" 
                : "message";
                
              window.dispatchEvent(new CustomEvent('trigger-island', {
                detail: {
                  state,
                  title: notification.title,
                  subtitle: notification.message,
                  onClick: () => {
                    if (state === "alert") window.location.href = "/notifications";
                    else window.location.href = "/chats";
                  }
                }
              }));
            
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
