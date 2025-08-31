'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

export interface WebSocketHook {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: unknown) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnect: () => void;
  subscribe: (channel: string, callback: (data: unknown) => void) => () => void;
  unsubscribe: (channel: string) => void;
}

export function useWebSocket(
  url: string,
  options: {
    reconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    onMessage?: (message: WebSocketMessage) => void;
  } = {},
): WebSocketHook {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const subscriptionsRef = useRef<Map<string, Set<(data: unknown) => void>>>(new Map());

  // Send heartbeat to keep connection alive
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
    }
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Subscribe to a channel
  const subscribe = useCallback(
    (channel: string, callback: (data: unknown) => void) => {
      if (!subscriptionsRef.current.has(channel)) {
        subscriptionsRef.current.set(channel, new Set());
      }
      subscriptionsRef.current.get(channel)!.add(callback);

      // Send subscription message to server
      sendMessage({ type: 'subscribe', channel });

      // Return unsubscribe function
      return () => {
        const channelSubs = subscriptionsRef.current.get(channel);
        if (channelSubs) {
          channelSubs.delete(callback);
          if (channelSubs.size === 0) {
            subscriptionsRef.current.delete(channel);
            // Send unsubscribe message to server
            sendMessage({ type: 'unsubscribe', channel });
          }
        }
      };
    },
    [sendMessage],
  );

  // Unsubscribe from a channel
  const unsubscribe = useCallback(
    (channel: string) => {
      if (subscriptionsRef.current.has(channel)) {
        subscriptionsRef.current.delete(channel);
        sendMessage({ type: 'unsubscribe', channel });
      }
    },
    [sendMessage],
  );

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectCountRef.current = 0;

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);

        onOpen?.();

        // Resubscribe to all channels
        subscriptionsRef.current.forEach((_, channel) => {
          sendMessage({ type: 'subscribe', channel });
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        onClose?.();

        // Attempt to reconnect
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})`,
            );
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        onError?.(error);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          // Handle subscriptions
          if (message.type && subscriptionsRef.current.has(message.type)) {
            const callbacks = subscriptionsRef.current.get(message.type)!;
            callbacks.forEach((callback) => callback(message.data));
          }

          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [
    url,
    reconnectAttempts,
    reconnectInterval,
    heartbeatInterval,
    sendHeartbeat,
    sendMessage,
    onOpen,
    onClose,
    onError,
    onMessage,
  ]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Reconnect manually
  const reconnect = useCallback(() => {
    reconnectCountRef.current = 0;
    disconnect();
    connect();
  }, [connect, disconnect]);

  // Connect on mount and cleanup on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connectionStatus,
    reconnect,
    subscribe,
    unsubscribe,
  };
}

// Specialized hooks for different data types

export function usePriceWebSocket() {
  const ws = useWebSocket('ws://localhost:3001/api/ws/prices', {
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  const [prices, setPrices] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const unsubscribe = ws.subscribe('price_update', (data) => {
      setPrices((prev) => ({
        ...prev,
        [(data as Record<string, unknown>).symbol as string]: {
          ...(data as Record<string, unknown>),
          lastUpdated: Date.now(),
        },
      }));
    });

    return unsubscribe;
  }, [ws]);

  return {
    ...ws,
    prices,
  };
}

export function useOrderBookWebSocket(symbol?: string) {
  const ws = useWebSocket('ws://localhost:3001/api/ws/orderbook', {
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  const [orderBook, setOrderBook] = useState<{
    bids: [number, number][];
    asks: [number, number][];
    lastUpdated: number;
  }>({
    bids: [],
    asks: [],
    lastUpdated: 0,
  });

  useEffect(() => {
    if (!symbol) return;

    const unsubscribe = ws.subscribe('orderbook_update', (data) => {
      const dataObj = data as Record<string, unknown>;
      if (dataObj.symbol === symbol) {
        setOrderBook({
          bids: (dataObj.bids as [number, number][]) || [],
          asks: (dataObj.asks as [number, number][]) || [],
          lastUpdated: Date.now(),
        });
      }
    });

    // Subscribe to specific symbol
    ws.sendMessage({ type: 'subscribe_orderbook', symbol });

    return () => {
      ws.sendMessage({ type: 'unsubscribe_orderbook', symbol });
      unsubscribe();
    };
  }, [ws, symbol]);

  return {
    ...ws,
    orderBook,
  };
}

export function useTradesWebSocket(symbol?: string) {
  const ws = useWebSocket('ws://localhost:3001/api/ws/trades', {
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  const [trades, setTrades] = useState<unknown[]>([]);

  useEffect(() => {
    if (!symbol) return;

    const unsubscribe = ws.subscribe('trade_update', (data) => {
      const dataObj = data as Record<string, unknown>;
      if (dataObj.symbol === symbol) {
        setTrades((prev) => [data, ...prev.slice(0, 99)]); // Keep last 100 trades
      }
    });

    // Subscribe to specific symbol
    ws.sendMessage({ type: 'subscribe_trades', symbol });

    return () => {
      ws.sendMessage({ type: 'unsubscribe_trades', symbol });
      unsubscribe();
    };
  }, [ws, symbol]);

  return {
    ...ws,
    trades,
  };
}
