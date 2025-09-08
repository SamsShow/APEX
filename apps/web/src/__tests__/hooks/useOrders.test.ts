import { renderHook, act, waitFor } from '@testing-library/react';
import { useOrders } from '@/hooks/useOrders';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Mock the wallet adapter
jest.mock('@aptos-labs/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

// Mock the notifications hook
jest.mock('@/hooks/useNotifications', () => ({
  useOrderNotifications: jest.fn(() => ({
    notifyOrderFilled: jest.fn(),
    notifyOrderPartial: jest.fn(),
    notifyOrderCancelled: jest.fn(),
    notifyOrderExpired: jest.fn(),
  })),
}));

// Mock Aptos SDK
jest.mock('@aptos-labs/ts-sdk', () => ({
  Aptos: jest.fn().mockImplementation(() => ({
    getAccountTransactions: jest.fn(),
  })),
  AptosConfig: jest.fn(),
  Network: {
    TESTNET: 'testnet',
  },
}));

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('useOrders', () => {
  const mockGetAccountTransactions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWallet.mockReturnValue({
      account: {
        address: '0x123',
        publicKey: '0x456',
      },
      connected: true,
    } as any);

    // Setup Aptos mock
    const { Aptos } = require('@aptos-labs/ts-sdk');
    Aptos.mockImplementation(() => ({
      getAccountTransactions: mockGetAccountTransactions,
    }));
  });

  describe('initial state', () => {
    it('should return correct initial state when wallet is connected', async () => {
      // Mock successful blockchain call for initial load
      mockGetAccountTransactions.mockResolvedValue([]);

      const { result } = renderHook(() => useOrders());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.orders.length).toBeGreaterThan(0); // Should have mock data
      expect(result.current.error).toBeNull();
      expect(result.current.lastUpdated).not.toBeNull();
      expect(typeof result.current.refreshOrders).toBe('function');
      expect(typeof result.current.addOrder).toBe('function');
      expect(typeof result.current.updateOrderStatus).toBe('function');
      expect(typeof result.current.getOrdersByStatus).toBe('function');
      expect(typeof result.current.getOrdersByType).toBe('function');
      expect(result.current.orderStats.total).toBeGreaterThan(0);
    });

    it('should return correct initial state when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      const { result } = renderHook(() => useOrders());

      expect(result.current.orders).toEqual([]);
    });
  });

  describe('fetchOrders', () => {
    it('should fetch orders successfully', async () => {
      const mockTransactions = [
        {
          hash: '0x123',
          timestamp: new Date().toISOString(),
          success: true,
          payload: {
            function:
              '0x9840325ffef7ffc5de961625fd9909d916eecd4fa515ddb2fdf4b38f47f5b083::option_contract::create_option',
            functionArguments: [100, 86400, 1],
          },
        },
      ];

      // Set up the mock before rendering
      mockGetAccountTransactions.mockResolvedValue(mockTransactions);

      const { result } = renderHook(() => useOrders());

      // Wait for fetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetAccountTransactions).toHaveBeenCalledWith({
        accountAddress: '0x123',
        options: {
          limit: 20,
        },
      });

      expect(result.current.orders.length).toBeGreaterThan(0);
      expect(result.current.lastUpdated).not.toBeNull();
    });

    it('should handle blockchain query failure and fallback to mock data', async () => {
      mockGetAccountTransactions.mockRejectedValue(new Error('Blockchain error'));

      const { result } = renderHook(() => useOrders());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull(); // Should not set error for fallback
      expect(result.current.orders.length).toBeGreaterThan(0); // Should have mock data
    });

    it('should not fetch when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      renderHook(() => useOrders());

      expect(mockGetAccountTransactions).not.toHaveBeenCalled();
    });
  });

  describe('addOrder', () => {
    it('should add new order to the list', () => {
      const { result } = renderHook(() => useOrders());

      const newOrder = {
        type: 'create_option' as const,
        status: 'pending' as const,
        timestamp: Date.now(),
        txHash: '0xnew',
        details: {
          optionType: 'call' as const,
          strikePrice: 100,
          expirySeconds: 86400,
          quantity: 1,
        },
      };

      act(() => {
        result.current.addOrder(newOrder);
      });

      expect(result.current.orders.length).toBe(1);
      expect(result.current.orders[0]).toMatchObject({
        ...newOrder,
        id: expect.any(String),
      });
      expect(result.current.orderStats.total).toBe(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status correctly', () => {
      const { result } = renderHook(() => useOrders());

      const newOrder = {
        type: 'create_option' as const,
        status: 'pending' as const,
        timestamp: Date.now(),
        txHash: '0xupdate',
        details: {
          optionType: 'call' as const,
          strikePrice: 100,
          expirySeconds: 86400,
          quantity: 1,
        },
      };

      act(() => {
        result.current.addOrder(newOrder);
      });

      const orderId = result.current.orders[0].id;

      act(() => {
        result.current.updateOrderStatus(orderId, 'confirmed', '0xconfirmed');
      });

      expect(result.current.orders[0].status).toBe('confirmed');
      expect(result.current.orders[0].txHash).toBe('0xconfirmed');
      expect(result.current.orderStats.confirmed).toBe(1);
      expect(result.current.orderStats.pending).toBe(0);
    });

    it('should handle error message when updating status to failed', () => {
      const { result } = renderHook(() => useOrders());

      const newOrder = {
        type: 'create_option' as const,
        status: 'pending' as const,
        timestamp: Date.now(),
        txHash: '0xfail',
        details: {
          optionType: 'call' as const,
          strikePrice: 100,
          expirySeconds: 86400,
          quantity: 1,
        },
      };

      act(() => {
        result.current.addOrder(newOrder);
      });

      const orderId = result.current.orders[0].id;

      act(() => {
        result.current.updateOrderStatus(orderId, 'failed', undefined, 'Transaction failed');
      });

      expect(result.current.orders[0].status).toBe('failed');
      expect(result.current.orders[0].errorMessage).toBe('Transaction failed');
      expect(result.current.orderStats.failed).toBe(1);
    });
  });

  describe('getOrdersByStatus', () => {
    it('should filter orders by status', () => {
      const { result } = renderHook(() => useOrders());

      const orders = [
        {
          type: 'create_option' as const,
          status: 'confirmed' as const,
          timestamp: Date.now(),
          txHash: '0x1',
          details: { optionType: 'call' as const, strikePrice: 100 },
        },
        {
          type: 'cancel_option' as const,
          status: 'pending' as const,
          timestamp: Date.now(),
          txHash: '0x2',
          details: { optionId: 1 },
        },
        {
          type: 'exercise_option' as const,
          status: 'confirmed' as const,
          timestamp: Date.now(),
          txHash: '0x3',
          details: { optionId: 2, settlementPrice: 105 },
        },
      ];

      act(() => {
        orders.forEach((order) => result.current.addOrder(order));
      });

      const confirmedOrders = result.current.getOrdersByStatus('confirmed');
      const pendingOrders = result.current.getOrdersByStatus('pending');

      expect(confirmedOrders.length).toBe(2);
      expect(pendingOrders.length).toBe(1);
    });
  });

  describe('getOrdersByType', () => {
    it('should filter orders by type', () => {
      const { result } = renderHook(() => useOrders());

      const orders = [
        {
          type: 'create_option' as const,
          status: 'confirmed' as const,
          timestamp: Date.now(),
          txHash: '0x1',
          details: { optionType: 'call' as const, strikePrice: 100 },
        },
        {
          type: 'cancel_option' as const,
          status: 'confirmed' as const,
          timestamp: Date.now(),
          txHash: '0x2',
          details: { optionId: 1 },
        },
        {
          type: 'create_option' as const,
          status: 'pending' as const,
          timestamp: Date.now(),
          txHash: '0x3',
          details: { optionType: 'put' as const, strikePrice: 95 },
        },
      ];

      act(() => {
        orders.forEach((order) => result.current.addOrder(order));
      });

      const createOrders = result.current.getOrdersByType('create_option');
      const cancelOrders = result.current.getOrdersByType('cancel_option');

      expect(createOrders.length).toBe(2);
      expect(cancelOrders.length).toBe(1);
    });
  });

  describe('polling', () => {
    it('should poll for updates when connected', async () => {
      jest.useFakeTimers();

      mockGetAccountTransactions.mockResolvedValue([]);

      renderHook(() => useOrders(1000)); // 1 second interval

      // Initial call should have happened
      expect(mockGetAccountTransactions).toHaveBeenCalledTimes(1);

      // Advance timer and wait for next poll
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(mockGetAccountTransactions).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    it('should not poll when pollInterval is 0', () => {
      mockGetAccountTransactions.mockResolvedValue([]);

      renderHook(() => useOrders(0));

      expect(mockGetAccountTransactions).toHaveBeenCalledTimes(1); // Only initial call
    });

    it('should not poll when wallet is not connected', () => {
      mockUseWallet.mockReturnValue({
        account: null,
        connected: false,
      } as any);

      renderHook(() => useOrders(1000));

      expect(mockGetAccountTransactions).not.toHaveBeenCalled();
    });
  });

  describe('refreshOrders', () => {
    it('should manually refresh orders', async () => {
      mockGetAccountTransactions.mockResolvedValue([]);

      const { result } = renderHook(() => useOrders());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCallCount = mockGetAccountTransactions.mock.calls.length;
      mockGetAccountTransactions.mockResolvedValue([]);

      act(() => {
        result.current.refreshOrders();
      });

      expect(mockGetAccountTransactions).toHaveBeenCalledTimes(initialCallCount + 1);
    });
  });

  describe('order notifications', () => {
    it('should trigger notifications on order status changes', async () => {
      const mockNotifyOrderFilled = jest.fn();
      const mockNotifyOrderCancelled = jest.fn();

      const { useOrderNotifications } = require('@/hooks/useNotifications');
      useOrderNotifications.mockReturnValue({
        notifyOrderFilled: mockNotifyOrderFilled,
        notifyOrderPartial: jest.fn(),
        notifyOrderCancelled: mockNotifyOrderCancelled,
        notifyOrderExpired: jest.fn(),
      });

      const { result } = renderHook(() => useOrders());

      const order = {
        type: 'create_option' as const,
        status: 'pending' as const,
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        txHash: '0xnotify',
        details: {
          optionType: 'call' as const,
          strikePrice: 100,
          quantity: 5,
        },
      };

      act(() => {
        result.current.addOrder(order);
      });

      const orderId = result.current.orders[0].id;

      // Update to confirmed
      act(() => {
        result.current.updateOrderStatus(orderId, 'confirmed');
      });

      expect(mockNotifyOrderFilled).toHaveBeenCalledWith(orderId, 'APT/USD', 5, 100);

      // Update to failed
      act(() => {
        result.current.updateOrderStatus(orderId, 'failed', undefined, 'Error');
      });

      expect(mockNotifyOrderCancelled).toHaveBeenCalledWith(orderId, 'APT/USD', 'Error');
    });
  });
});
