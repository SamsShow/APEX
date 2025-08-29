'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { OptionType } from '@/lib/shared-types';

export interface Order {
  id: string;
  type: 'create_option' | 'cancel_option' | 'exercise_option' | 'create_series';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
  details: {
    optionType?: OptionType;
    strikePrice?: number;
    expirySeconds?: number;
    quantity?: number;
    optionId?: number;
    settlementPrice?: number;
  };
  gasUsed?: string;
  errorMessage?: string;
}

export function useOrders() {
  const { account, connected } = useWallet();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock orders data for demonstration
  const mockOrders: Order[] = useMemo(
    () => [
      {
        id: '1',
        type: 'create_option',
        status: 'confirmed',
        timestamp: Date.now() - 86400000, // 1 day ago
        txHash: '0x1234567890abcdef',
        details: {
          optionType: 'call',
          strikePrice: 100,
          expirySeconds: Math.floor(Date.now() / 1000) + 86400 * 30,
          quantity: 5,
        },
        gasUsed: '0.001 APT',
      },
      {
        id: '2',
        type: 'create_option',
        status: 'confirmed',
        timestamp: Date.now() - 43200000, // 12 hours ago
        txHash: '0xabcdef1234567890',
        details: {
          optionType: 'put',
          strikePrice: 95,
          expirySeconds: Math.floor(Date.now() / 1000) + 86400 * 7,
          quantity: 3,
        },
        gasUsed: '0.001 APT',
      },
      {
        id: '3',
        type: 'cancel_option',
        status: 'confirmed',
        timestamp: Date.now() - 3600000, // 1 hour ago
        txHash: '0xfedcba0987654321',
        details: {
          optionId: 1,
        },
        gasUsed: '0.0005 APT',
      },
      {
        id: '4',
        type: 'exercise_option',
        status: 'pending',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        txHash: '0x9876543210fedcba',
        details: {
          optionId: 2,
          settlementPrice: 102,
        },
      },
    ],
    [],
  );

  // Fetch orders from blockchain (mock implementation for now)
  const fetchOrders = useCallback(async () => {
    if (!connected || !account?.address) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with real blockchain queries
      // For now, simulate fetching from blockchain with mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate dynamic data based on user address
      const userOrders = mockOrders.map((order, index) => ({
        ...order,
        id: `${account.address.toString().slice(-4)}-${index + 1}`,
        txHash: order.txHash
          ? `${order.txHash.slice(0, -4)}${account.address.toString().slice(-4)}`
          : undefined,
      }));

      setOrders(userOrders);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', errorMessage);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, mockOrders]);

  // Add new order to the list
  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(
    (orderId: string, status: Order['status'], txHash?: string, errorMessage?: string) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status, txHash, errorMessage } : order,
        ),
      );
    },
    [],
  );

  // Refresh orders
  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh orders when wallet connection changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Get orders by status
  const getOrdersByStatus = useCallback(
    (status: Order['status']) => {
      return orders.filter((order) => order.status === status);
    },
    [orders],
  );

  // Get orders by type
  const getOrdersByType = useCallback(
    (type: Order['type']) => {
      return orders.filter((order) => order.type === type);
    },
    [orders],
  );

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: getOrdersByStatus('pending').length,
    confirmed: getOrdersByStatus('confirmed').length,
    failed: getOrdersByStatus('failed').length,
    recentActivity: orders.slice(0, 5), // Last 5 orders
  };

  return {
    orders,
    isLoading,
    error,
    refreshOrders,
    addOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getOrdersByType,
    orderStats,
  };
}
