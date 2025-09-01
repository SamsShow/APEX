'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { OptionType, APEX_CONTRACT_CONFIG } from '@/lib/shared-types';
import { useErrorHandler } from './useErrorHandler';

// Import Aptos SDK for real contract interactions
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Initialize Aptos client for contract calls
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
const aptosClient = new Aptos(aptosConfig);

export function useOptionsContract(onTransactionSuccess?: () => void) {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleTransactionError } = useErrorHandler();

  // Initialize user account
  const initAccount = useCallback(async (): Promise<string | null> => {
    if (!connected || !account?.address) {
      console.warn('Wallet not connected: Please connect your wallet first');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::init_account`,
        typeArguments: [],
        functionArguments: [],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await signAndSubmitTransaction(payload as any);
      console.log('Account initialized successfully:', response.hash);

      // Call success callback to refresh data
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }

      return response.hash;
    } catch (err: unknown) {
      const parsedError = handleTransactionError(err, 'Account Initialization');
      setError(parsedError.userMessage);

      console.error('Account initialization failed:', parsedError);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, signAndSubmitTransaction, onTransactionSuccess, handleTransactionError]);

  // Create a new option contract
  const createOption = useCallback(
    async (
      strikePrice: number,
      expirySeconds: number,
      optionType: OptionType,
      quantity: number,
    ): Promise<string | null> => {
      if (!connected || !account?.address) {
        console.warn('Wallet not connected: Please connect your wallet first');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const optionTypeValue = optionType === 'call' ? 0 : 1; // OPTION_TYPE_CALL = 0, OPTION_TYPE_PUT = 1

        const payload = {
          data: {
            function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::create_option`,
            typeArguments: [],
            functionArguments: [strikePrice, expirySeconds, optionTypeValue, quantity],
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await signAndSubmitTransaction(payload as any);
        console.log(`Successfully created ${quantity} ${optionType} option(s):`, response.hash);

        // Call success callback to refresh data
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }

        return response.hash;
      } catch (err: unknown) {
        const parsedError = handleTransactionError(err, 'Option Creation');
        setError(parsedError.userMessage);

        console.error('Option creation failed:', parsedError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, account, signAndSubmitTransaction, onTransactionSuccess, handleTransactionError],
  );

  // Cancel an option
  const cancelOption = useCallback(
    async (optionId: number): Promise<string | null> => {
      if (!connected || !account?.address) {
        console.warn('Wallet not connected: Please connect your wallet first');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          data: {
            function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::cancel_option`,
            typeArguments: [],
            functionArguments: [optionId],
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await signAndSubmitTransaction(payload as any);
        console.log('Option cancelled successfully:', response.hash);

        // Call success callback to refresh data
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }

        return response.hash;
      } catch (err: unknown) {
        const parsedError = handleTransactionError(err, 'Option Cancellation');
        setError(parsedError.userMessage);

        console.error('Option cancellation failed:', parsedError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, account, signAndSubmitTransaction, onTransactionSuccess, handleTransactionError],
  );

  // Cancel an order (different from canceling an option - this cancels pending orders)
  const cancelOrder = useCallback(
    async (_orderId: string): Promise<string | null> => {
      if (!connected || !account?.address) {
        console.warn('Wallet not connected: Please connect your wallet first');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // For now, this is a placeholder - in a real implementation,
        // you might need to call a specific contract function or
        // handle order cancellation through a matching engine

        // TODO: Implement real order cancellation logic
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
        const txHash = `0xcancel_${_orderId}_${Math.random().toString(16).substring(2, 10)}...`;

        console.log('Order cancelled successfully:', txHash);

        // Call success callback to refresh data
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }

        return txHash;
      } catch (err: unknown) {
        const parsedError = handleTransactionError(err, 'Order Cancellation');
        setError(parsedError.userMessage);

        console.error('Order cancellation failed:', parsedError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, account, onTransactionSuccess, handleTransactionError],
  );

  // Exercise an option
  const exerciseOption = useCallback(
    async (optionId: number, settlementPrice: number): Promise<string | null> => {
      if (!connected || !account?.address) {
        console.warn('Wallet not connected: Please connect your wallet first');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          data: {
            function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::exercise_option`,
            typeArguments: [],
            functionArguments: [optionId, settlementPrice],
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await signAndSubmitTransaction(payload as any);
        console.log('Option exercised successfully:', response.hash);

        // Call success callback to refresh data
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }

        return response.hash;
      } catch (err: unknown) {
        const parsedError = handleTransactionError(err, 'Option Exercise');
        setError(parsedError.userMessage);

        console.error('Exercise failed:', parsedError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, account, signAndSubmitTransaction, onTransactionSuccess, handleTransactionError],
  );

  // Create an option series
  const createSeries = useCallback(
    async (
      strikePrice: number,
      expirySeconds: number,
      optionType: OptionType,
    ): Promise<string | null> => {
      if (!connected || !account?.address) {
        console.warn('Wallet not connected: Please connect your wallet first');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const optionTypeValue = optionType === 'call' ? 0 : 1;

        const payload = {
          data: {
            function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::create_series`,
            typeArguments: [],
            functionArguments: [strikePrice, expirySeconds, optionTypeValue],
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await signAndSubmitTransaction(payload as any);
        console.log('Series created successfully:', response.hash);

        // Call success callback to refresh data
        if (onTransactionSuccess) {
          onTransactionSuccess();
        }

        return response.hash;
      } catch (err: unknown) {
        const parsedError = handleTransactionError(err, 'Series Creation');
        setError(parsedError.userMessage);

        console.error('Series creation failed:', parsedError);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connected, account, signAndSubmitTransaction, onTransactionSuccess, handleTransactionError],
  );

  // Read-only functions (don't require signing)
  const getNumOptions = useCallback(async (): Promise<number> => {
    if (!account?.address) return 0;

    try {
      const result = await aptosClient.view({
        payload: {
          function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::get_num_options`,
          typeArguments: [],
          functionArguments: [account.address.toString()],
        },
      });

      return Number(result[0]);
    } catch (err) {
      console.error('Failed to get number of options:', err);
      return 0;
    }
  }, [account]);

  const getPortfolioLegs = useCallback(async (): Promise<number[]> => {
    if (!account?.address) return [];

    try {
      const result = await aptosClient.view({
        payload: {
          function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::get_portfolio_legs`,
          typeArguments: [],
          functionArguments: [account.address.toString()],
        },
      });

      return (result[0] as number[]).map(Number);
    } catch (err) {
      console.error('Failed to get portfolio legs:', err);
      return [];
    }
  }, [account]);

  const getAptBalance = useCallback(async (): Promise<number> => {
    if (!account?.address) return 0;

    try {
      const balance = await aptosClient.getAccountAPTAmount({
        accountAddress: account.address.toString(),
      });
      return Number(balance) / 100000000; // Convert from octas to APT
    } catch (err) {
      console.error('Failed to get APT balance:', err);
      return 0;
    }
  }, [account]);

  const isAccountInitialized = useCallback(async (): Promise<boolean> => {
    if (!account?.address) return false;

    try {
      // Try to get options count - if it succeeds, account is initialized
      await getNumOptions();
      return true;
    } catch (err) {
      return false;
    }
  }, [account, getNumOptions]);

  return {
    // State
    isLoading,
    error,
    connected,

    // Write functions (require signing)
    initAccount,
    createOption,
    cancelOption,
    cancelOrder,
    exerciseOption,
    createSeries,

    // Read functions (view only)
    getNumOptions,
    getPortfolioLegs,
    getAptBalance,
    isAccountInitialized,
  };
}
