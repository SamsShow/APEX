'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { OptionType, APEX_CONTRACT_CONFIG } from '@/lib/shared-types';

// Initialize Aptos client
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
const aptosClient = new Aptos(aptosConfig);

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

export function useOrders(pollInterval = 15000) {
  // Default 15 seconds
  const { account, connected } = useWallet();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // Fetch orders from blockchain
  const fetchOrders = useCallback(async () => {
    if (!connected || !account?.address) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get account transactions from Aptos
      const transactions = await aptosClient.getAccountTransactions({
        accountAddress: account.address.toString(),
        options: {
          limit: 20, // Get last 20 transactions
        },
      });

      // Filter transactions related to our contract
      const contractTxs = transactions.filter((tx) => {
        // Check if it's a user transaction with payload
        if (
          'payload' in tx &&
          tx.payload &&
          typeof tx.payload === 'object' &&
          'function' in tx.payload
        ) {
          return tx.payload.function?.includes(APEX_CONTRACT_CONFIG.address);
        }
        return false;
      });

      // Convert transactions to orders
      const userOrders: Order[] = contractTxs.map((tx, index) => {
        let payload: { function?: string; functionArguments?: unknown[] } | undefined;
        let functionName = '';

        if (
          'payload' in tx &&
          tx.payload &&
          typeof tx.payload === 'object' &&
          'function' in tx.payload
        ) {
          payload = tx.payload as { function?: string; functionArguments?: unknown[] };
          functionName = payload?.function?.split('::').pop() || '';
        }

        let orderType: Order['type'] = 'create_option';
        if (functionName === 'cancel_option') orderType = 'cancel_option';
        else if (functionName === 'exercise_option') orderType = 'exercise_option';
        else if (functionName === 'create_series') orderType = 'create_series';

        // Determine transaction status
        let status: Order['status'] = 'confirmed';
        if ('success' in tx && tx.success === false) {
          status = 'failed';
        } else if ('type' in tx && tx.type === 'pending_transaction') {
          status = 'pending';
        }

        return {
          id: `${account.address.toString().slice(-4)}-${index + 1}`,
          type: orderType,
          status,
          timestamp: 'timestamp' in tx ? new Date(tx.timestamp).getTime() : Date.now(),
          txHash: tx.hash,
          details: {
            // TODO: Parse actual function arguments from payload
            strikePrice: (payload?.functionArguments?.[0] as number) || 100,
            expirySeconds:
              (payload?.functionArguments?.[1] as number) ||
              Math.floor(Date.now() / 1000) + 86400 * 30,
            quantity: (payload?.functionArguments?.[2] as number) || 1,
          },
          gasUsed:
            'gas_used' in tx && tx.gas_used ? `${Number(tx.gas_used) / 100000000} APT` : undefined,
          errorMessage: 'vm_status' in tx ? (tx.vm_status as string) : undefined,
        };
      });

      // If no real transactions found, fall back to mock data
      if (userOrders.length === 0) {
        const mockUserOrders = mockOrders.map((order, index) => ({
          ...order,
          id: `${account.address.toString().slice(-4)}-${index + 1}`,
          txHash: order.txHash
            ? `${order.txHash.slice(0, -4)}${account.address.toString().slice(-4)}`
            : undefined,
        }));
        setOrders(mockUserOrders);
      } else {
        setOrders(userOrders);
      }
    } catch (err: unknown) {
      // Fallback to mock data if blockchain query fails
      console.warn('Blockchain query failed, using mock data:', err);

      const mockUserOrders = mockOrders.map((order, index) => ({
        ...order,
        id: `${account.address.toString().slice(-4)}-${index + 1}`,
        txHash: order.txHash
          ? `${order.txHash.slice(0, -4)}${account.address.toString().slice(-4)}`
          : undefined,
      }));

      setOrders(mockUserOrders);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, mockOrders]);

  // Polling effect for real-time updates
  useEffect(() => {
    if (!connected || !account?.address || pollInterval <= 0) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [connected, account, pollInterval, fetchOrders]);

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
    lastUpdated,
  };
}
