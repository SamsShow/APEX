'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
const aptosClient = new Aptos(aptosConfig);

export interface TransactionDetails {
  type: 'create_option' | 'cancel_option' | 'exercise_option' | 'create_series' | 'init_account';
  optionType?: 'call' | 'put';
  strikePrice?: number;
  expirySeconds?: number;
  quantity?: number;
  optionId?: number;
  settlementPrice?: number;
  gasUsed?: string;
  gasFee?: string;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  txHash: string;
  blockNumber?: number;
  networkFee?: string;
  functionName?: string;
  arguments?: unknown[];
}

export interface TransactionHistory {
  transactions: TransactionDetails[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  stats: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalGasSpent: number;
    averageGasFee: number;
    totalVolume: number;
  };
}

export function useTransactionHistory(limit = 50, offset = 0) {
  const { account, connected } = useWallet();
  const [history, setHistory] = useState<TransactionHistory>({
    transactions: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    stats: {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      pendingTransactions: 0,
      totalGasSpent: 0,
      averageGasFee: 0,
      totalVolume: 0,
    },
  });

  // Parse transaction payload to extract details
  const parseTransactionPayload = useCallback((payload: unknown): Partial<TransactionDetails> => {
    if (!payload || typeof payload !== 'object') return {};

    const payloadObj = payload as Record<string, unknown>;
    const functionName =
      typeof payloadObj.function === 'string' ? payloadObj.function?.split('::').pop() || '' : '';
    const args = Array.isArray(payloadObj.functionArguments) ? payloadObj.functionArguments : [];

    switch (functionName) {
      case 'init_account':
        return {
          type: 'init_account',
          functionName,
          arguments: args,
        };

      case 'create_option':
        return {
          type: 'create_option',
          optionType: args[2] === 0 ? 'call' : 'put',
          strikePrice: Number(args[0]) / 1000000, // Convert from smallest unit
          expirySeconds: Number(args[1]),
          quantity: Number(args[3]),
          functionName,
          arguments: args,
        };

      case 'cancel_option':
        return {
          type: 'cancel_option',
          optionId: Number(args[0]),
          functionName,
          arguments: args,
        };

      case 'exercise_option':
        return {
          type: 'exercise_option',
          optionId: Number(args[0]),
          settlementPrice: Number(args[1]) / 1000000,
          functionName,
          arguments: args,
        };

      case 'create_series':
        return {
          type: 'create_series',
          optionType: args[2] === 0 ? 'call' : 'put',
          strikePrice: Number(args[0]) / 1000000,
          expirySeconds: Number(args[1]),
          functionName,
          arguments: args,
        };

      default:
        return {
          functionName,
          arguments: args,
        };
    }
  }, []);

  // Fetch transaction history from blockchain
  const fetchTransactionHistory = useCallback(async () => {
    if (!connected || !account?.address) {
      setHistory((prev) => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setHistory((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get account transactions
      const accountTransactions = await aptosClient.getAccountTransactions({
        accountAddress: account.address,
        options: {
          limit: limit,
          offset: offset,
        },
      });

      // Filter and parse transactions
      const parsedTransactions: TransactionDetails[] = accountTransactions
        .filter((tx) => {
          // Only include transactions from our contract
          if (tx.type !== 'user_transaction') return false;

          const payload = (tx as Record<string, unknown>).payload;
          if (!payload || typeof payload !== 'object') return false;

          const functionName = (payload as Record<string, unknown>).function
            ? String((payload as Record<string, unknown>).function)
            : '';
          return functionName.includes('option_contract');
        })
        .map((tx) => {
          const userTx = tx as Record<string, unknown>;
          const payload = userTx.payload;
          const parsedDetails = parseTransactionPayload(payload);

          return {
            ...parsedDetails,
            timestamp: userTx.timestamp ? Number(userTx.timestamp) / 1000 : Date.now(),
            status: userTx.success ? 'success' : 'failed',
            txHash: userTx.hash,
            blockNumber: userTx.version ? Number(userTx.version) : undefined,
            gasUsed: userTx.gas_used ? `${Number(userTx.gas_used) / 100000000} APT` : undefined,
            gasFee: userTx.gas_used
              ? `${(Number(userTx.gas_used) * 0.1) / 100000000} APT`
              : undefined,
          } as TransactionDetails;
        })
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

      // Calculate statistics
      const stats = {
        totalTransactions: parsedTransactions.length,
        successfulTransactions: parsedTransactions.filter((tx) => tx.status === 'success').length,
        failedTransactions: parsedTransactions.filter((tx) => tx.status === 'failed').length,
        pendingTransactions: parsedTransactions.filter((tx) => tx.status === 'pending').length,
        totalGasSpent: parsedTransactions
          .filter((tx) => tx.gasFee)
          .reduce((sum, tx) => sum + (parseFloat(tx.gasFee!.replace(' APT', '')) || 0), 0),
        averageGasFee: 0,
        totalVolume: parsedTransactions
          .filter((tx) => tx.type === 'create_option' && tx.strikePrice && tx.quantity)
          .reduce((sum, tx) => sum + tx.strikePrice! * tx.quantity!, 0),
      };

      stats.averageGasFee =
        stats.totalTransactions > 0 ? stats.totalGasSpent / stats.totalTransactions : 0;

      setHistory({
        transactions: parsedTransactions,
        isLoading: false,
        error: null,
        totalCount: parsedTransactions.length,
        stats,
      });
    } catch (error: unknown) {
      console.error('Failed to fetch transaction history:', error);
      setHistory((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Failed to fetch transaction history',
      }));
    }
  }, [connected, account, limit, offset, parseTransactionPayload]);

  // Refresh transaction history
  const refreshHistory = useCallback(() => {
    fetchTransactionHistory();
  }, [fetchTransactionHistory]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchTransactionHistory();

    const interval = setInterval(() => {
      fetchTransactionHistory();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchTransactionHistory]);

  // Filter transactions by type
  const getTransactionsByType = useCallback(
    (type: TransactionDetails['type']) => {
      return history.transactions.filter((tx) => tx.type === type);
    },
    [history.transactions],
  );

  // Filter transactions by status
  const getTransactionsByStatus = useCallback(
    (status: TransactionDetails['status']) => {
      return history.transactions.filter((tx) => tx.status === status);
    },
    [history.transactions],
  );

  // Get transactions within date range
  const getTransactionsInRange = useCallback(
    (startDate: Date, endDate: Date) => {
      const start = startDate.getTime() / 1000;
      const end = endDate.getTime() / 1000;
      return history.transactions.filter((tx) => tx.timestamp >= start && tx.timestamp <= end);
    },
    [history.transactions],
  );

  return {
    ...history,
    refreshHistory,
    getTransactionsByType,
    getTransactionsByStatus,
    getTransactionsInRange,
  };
}
