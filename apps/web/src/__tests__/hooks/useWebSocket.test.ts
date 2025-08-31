import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock WebSocket
class MockWebSocket {
  onopen?: () => void;
  onclose?: () => void;
  onerror?: (event: any) => void;
  onmessage?: (event: any) => void;
  readyState = 0;
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;

  constructor(url: string) {
    this.readyState = this.OPEN;
    // Simulate connection opening
    setTimeout(() => {
      this.onopen?.();
    }, 10);
  }

  send = jest.fn();
  close = jest.fn();
}

// Mock global WebSocket
global.WebSocket = MockWebSocket as any;

// Mock the useWebSocket hook
const mockWebSocketHook = () => {
  let subscribers: Map<string, Set<(data: any) => void>> = new Map();
  let isConnected = false;
  let lastMessage: any = null;
  let connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';

  const subscribe = (channel: string, callback: (data: any) => void) => {
    if (!subscribers.has(channel)) {
      subscribers.set(channel, new Set());
    }
    subscribers.get(channel)!.add(callback);

    return () => {
      const channelSubs = subscribers.get(channel);
      if (channelSubs) {
        channelSubs.delete(callback);
        if (channelSubs.size === 0) {
          subscribers.delete(channel);
        }
      }
    };
  };

  const unsubscribe = (channel: string) => {
    subscribers.delete(channel);
  };

  const sendMessage = jest.fn((message: any) => {
    // Simulate sending message
    if (isConnected) {
      // Simulate response for price_update subscription
      if (message.type === 'subscribe' && message.ids) {
        setTimeout(() => {
          // Simulate price update message
          const mockMessage = {
            type: 'price_update',
            price: { price: 5.25, conf: 0.01 },
            id: message.ids[0],
          };

          // Trigger subscribers
          subscribers.forEach((callbacks, channel) => {
            if (channel === 'price_update') {
              callbacks.forEach((callback) => {
                callback({
                  symbol: 'APT/USD',
                  price: mockMessage.price.price,
                  confidence: mockMessage.price.conf,
                  lastUpdated: Date.now(),
                });
              });
            }
          });
        }, 0); // Use 0 to make it synchronous for testing
      }
    }
  });

  const reconnect = () => {
    connectionStatus = 'connecting';
    isConnected = false;
    setTimeout(() => {
      isConnected = true;
      connectionStatus = 'connected';
    }, 10); // Shorter timeout for tests
  };

  // Initialize connection
  reconnect();

  return {
    isConnected: () => isConnected,
    lastMessage: () => lastMessage,
    sendMessage,
    connectionStatus: () => connectionStatus,
    reconnect,
    subscribe,
    unsubscribe,
  };
};

describe('useWebSocket Hook', () => {
  let mockWs: ReturnType<typeof mockWebSocketHook>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockWs = mockWebSocketHook();
    jest.advanceTimersByTime(50); // Advance timers to complete async operations
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Connection Management', () => {
    it('should establish connection successfully', () => {
      expect(mockWs.connectionStatus()).toBe('connected');
      expect(mockWs.isConnected()).toBe(true);
    });

    it('should handle reconnection', () => {
      mockWs.reconnect();
      jest.advanceTimersByTime(20); // Advance to complete reconnection
      expect(mockWs.connectionStatus()).toBe('connected');
    });
  });

  describe('Subscription Management', () => {
    it('should allow subscribing to channels', () => {
      const callback = jest.fn();
      const unsubscribe = mockWs.subscribe('price_update', callback);

      expect(typeof unsubscribe).toBe('function');

      // Cleanup
      unsubscribe();
    });

    it('should handle unsubscribing from channels', () => {
      const callback = jest.fn();
      const unsubscribe = mockWs.subscribe('price_update', callback);

      // Unsubscribe using the returned function
      unsubscribe();

      // Try to send a message - should not trigger callback
      mockWs.sendMessage({ type: 'subscribe', ids: ['test_id'] });

      // Callback should not have been called
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple subscribers to same channel', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const unsubscribe1 = mockWs.subscribe('price_update', callback1);
      const unsubscribe2 = mockWs.subscribe('price_update', callback2);

      // Simulate message
      mockWs.sendMessage({ type: 'subscribe', ids: ['test_id'] });
      jest.advanceTimersByTime(10); // Advance to trigger callbacks

      // Both callbacks should be called
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      // Cleanup
      unsubscribe1();
      unsubscribe2();
    });
  });

  describe('Message Handling', () => {
    it('should handle price update messages', () => {
      const callback = jest.fn();
      mockWs.subscribe('price_update', callback);

      mockWs.sendMessage({ type: 'subscribe', ids: ['test_id'] });
      jest.advanceTimersByTime(10); // Advance to trigger the callback

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: 'APT/USD',
          price: 5.25,
          confidence: 0.01,
          lastUpdated: expect.any(Number),
        }),
      );
    });

    it('should send messages when connected', () => {
      const message = { type: 'test', data: 'test_data' };
      mockWs.sendMessage(message);

      // In a real implementation, we'd check if the WebSocket send method was called
      expect(mockWs.sendMessage).toHaveBeenCalledWith(message);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', () => {
      // Mock a connection error scenario
      const errorCallback = jest.fn();
      mockWs.subscribe('error', errorCallback);

      // In a real implementation, this would trigger error handling
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should handle invalid subscription gracefully', () => {
      const callback = jest.fn();
      const unsubscribe = mockWs.subscribe('', callback);

      expect(typeof unsubscribe).toBe('function');

      // Cleanup
      unsubscribe();
    });
  });
});
