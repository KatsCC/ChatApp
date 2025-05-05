import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";
import * as SecureStore from "expo-secure-store";

interface UseStompSockJSReturn {
  messages: string[];
  sendMessage: (chatRoomId: string | number, message: string) => void;
  subscribe: (
    destination: string,
    callback: (message: any) => void
  ) => StompSubscription | null;
  isConnected: boolean;
}

export const useStompSockJS = (url: string): UseStompSockJSReturn => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [token, setToken] = useState<string | null | undefined>(null);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("jwtToken");
        const urlToken = storedToken?.slice(1, -1);

        setToken(urlToken);
      } catch (error) {
        console.error("토큰 불러오기 오류:", error);
      }
    };
    loadToken();
  }, []);

  // STOMP 클라이언트 초기화
  useEffect(() => {
    if (!token) return;

    const socket = new SockJS(`${url}?token=${token}`);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 재연결 지연 (ms)
      debug: (str) => console.log("STOMP: " + str),
      onConnect: () => {
        setIsConnected(true);
        console.log("STOMP connected");
      },
      onWebSocketClose: () => {
        setIsConnected(false);
        console.log("STOMP WebSocket closed");
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log("STOMP disconnected");
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((subscription) =>
        subscription.unsubscribe()
      );
      client.deactivate();
    };
  }, [url, token]);

  // STOMP 메시지 전송
  const sendMessage = useCallback(
    (chatRoomId: string | number, message: string) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        const destination = `/app/chat/rooms/${chatRoomId}/message`;
        stompClientRef.current.publish({
          destination,
          body: message,
        });
      } else {
        console.error("STOMP client is not connected. Unable to send message.");
      }
    },
    [token]
  );

  // STOMP 구독
  const subscribe = useCallback(
    (
      destination: string,
      callback: (message: any) => void
    ): StompSubscription | null => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        const subscription = stompClientRef.current.subscribe(
          destination,
          callback
        );
        subscriptionsRef.current.push(subscription);
        return subscription;
      } else {
        console.error("STOMP client is not connected. Unable to subscribe.");
        return null;
      }
    },
    []
  );

  return { messages, sendMessage, subscribe, isConnected };
};
