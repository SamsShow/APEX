'use client';

import { useCallback } from 'react';
import { useNotifications } from './useNotifications';

export interface BlockchainError {
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
  userMessage: string;
  suggestedAction?: string;
}

export function useErrorHandler() {
  const { notifyError, notifyWarning, notifyInfo } = useNotifications();

  const parseAptosError = useCallback((error: unknown): BlockchainError => {
    // Handle different types of Aptos errors
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: unknown }).message)
        : '';

    if (errorMessage.includes('INSUFFICIENT_BALANCE')) {
      return {
        code: 'INSUFFICIENT_BALANCE',
        message: 'Account has insufficient balance for this transaction',
        details: error,
        recoverable: true,
        userMessage: 'Not enough APT in your wallet',
        suggestedAction: 'Add more APT to your wallet or reduce transaction amount',
      };
    }

    if (
      errorMessage.includes('ACCOUNT_DOES_NOT_EXIST') ||
      errorMessage.includes('ACCOUNT_NOT_INITIALIZED')
    ) {
      return {
        code: 'ACCOUNT_NOT_INITIALIZED',
        message: 'Account needs to be initialized on the blockchain',
        details: error,
        recoverable: true,
        userMessage: 'Your account needs to be initialized first',
        suggestedAction: 'Initialize your account before trading',
      };
    }

    if (errorMessage.includes('MODULE_ADDRESS_DOES_NOT_MATCH_SENDER')) {
      return {
        code: 'CONTRACT_ADDRESS_MISMATCH',
        message: 'Smart contract address mismatch',
        details: error,
        recoverable: false,
        userMessage: 'Smart contract configuration error',
        suggestedAction: 'Please contact support',
      };
    }

    if (errorMessage.includes('FUNCTION_NOT_FOUND')) {
      return {
        code: 'FUNCTION_NOT_FOUND',
        message: 'Requested smart contract function not found',
        details: error,
        recoverable: false,
        userMessage: 'Smart contract function unavailable',
        suggestedAction: 'Try again later or contact support',
      };
    }

    if (errorMessage.includes('SEQUENCE_NUMBER_TOO_OLD')) {
      return {
        code: 'SEQUENCE_NUMBER_ERROR',
        message: 'Transaction sequence number is outdated',
        details: error,
        recoverable: true,
        userMessage: 'Transaction sequence error',
        suggestedAction: 'Please try again',
      };
    }

    if (errorMessage.includes('GAS_UNIT_PRICE_TOO_LOW')) {
      return {
        code: 'GAS_PRICE_TOO_LOW',
        message: 'Gas price is too low for current network conditions',
        details: error,
        recoverable: true,
        userMessage: 'Gas price too low',
        suggestedAction: 'Increase gas price and try again',
      };
    }

    if (errorMessage.includes('INSUFFICIENT_GAS')) {
      return {
        code: 'INSUFFICIENT_GAS',
        message: 'Transaction ran out of gas',
        details: error,
        recoverable: true,
        userMessage: 'Transaction failed due to insufficient gas',
        suggestedAction: 'Increase gas limit and try again',
      };
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return {
        code: 'NETWORK_TIMEOUT',
        message: 'Network request timed out',
        details: error,
        recoverable: true,
        userMessage: 'Network timeout - please check your connection',
        suggestedAction: 'Check your internet connection and try again',
      };
    }

    if (errorMessage.includes('WALLET_NOT_CONNECTED')) {
      return {
        code: 'WALLET_DISCONNECTED',
        message: 'Wallet is not connected',
        details: error,
        recoverable: true,
        userMessage: 'Please connect your wallet',
        suggestedAction: 'Connect your wallet and try again',
      };
    }

    if (errorMessage.includes('USER_REJECTED')) {
      return {
        code: 'USER_REJECTED',
        message: 'User rejected the transaction',
        details: error,
        recoverable: true,
        userMessage: 'Transaction was cancelled',
        suggestedAction: 'You can try again if you change your mind',
      };
    }

    // Generic blockchain error
    return {
      code: 'BLOCKCHAIN_ERROR',
      message:
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Unknown blockchain error',
      details: error,
      recoverable: true,
      userMessage: 'Transaction failed',
      suggestedAction: 'Please try again or contact support if the problem persists',
    };
  }, []);

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      console.error(`Error in ${context || 'unknown context'}:`, error);

      const parsedError = parseAptosError(error);

      // Show appropriate notification based on error type
      switch (parsedError.code) {
        case 'INSUFFICIENT_BALANCE':
        case 'ACCOUNT_NOT_INITIALIZED':
        case 'SEQUENCE_NUMBER_ERROR':
        case 'USER_REJECTED':
          notifyWarning(parsedError.userMessage, parsedError.suggestedAction);
          break;

        case 'CONTRACT_ADDRESS_MISMATCH':
        case 'FUNCTION_NOT_FOUND':
        case 'GAS_PRICE_TOO_LOW':
        case 'INSUFFICIENT_GAS':
          notifyError(parsedError.userMessage, parsedError.suggestedAction);
          break;

        case 'NETWORK_TIMEOUT':
          notifyInfo('Connection Issue', parsedError.suggestedAction);
          break;

        default:
          notifyError('Transaction Failed', parsedError.userMessage);
          break;
      }

      return parsedError;
    },
    [parseAptosError, notifyError, notifyWarning, notifyInfo],
  );

  const handleTransactionError = useCallback(
    (error: unknown, action: string) => {
      console.error(`Transaction error during ${action}:`, error);

      const parsedError = parseAptosError(error);

      // Add context to the error message
      const contextualMessage = `${action} failed: ${parsedError.userMessage}`;

      switch (parsedError.code) {
        case 'INSUFFICIENT_BALANCE':
          notifyError(
            'Insufficient Balance',
            `Cannot ${action.toLowerCase()} - ${parsedError.userMessage}`,
          );
          break;

        case 'ACCOUNT_NOT_INITIALIZED':
          notifyWarning('Account Setup Required', parsedError.userMessage);
          break;

        case 'USER_REJECTED':
          notifyInfo('Transaction Cancelled', parsedError.userMessage);
          break;

        case 'NETWORK_TIMEOUT':
          notifyWarning('Network Issue', `Connection timeout during ${action.toLowerCase()}`);
          break;

        default:
          notifyError('Transaction Failed', contextualMessage);
          break;
      }

      return parsedError;
    },
    [parseAptosError, notifyError, notifyWarning, notifyInfo],
  );

  const handleWalletError = useCallback(
    (error: unknown) => {
      console.error('Wallet error:', error);

      const parsedError = parseAptosError(error);

      switch (parsedError.code) {
        case 'WALLET_DISCONNECTED':
          notifyWarning('Wallet Disconnected', 'Please reconnect your wallet to continue trading');
          break;

        case 'USER_REJECTED':
          notifyInfo('Action Cancelled', 'Transaction was cancelled by user');
          break;

        default:
          notifyError('Wallet Error', parsedError.userMessage);
          break;
      }

      return parsedError;
    },
    [parseAptosError, notifyError, notifyWarning, notifyInfo],
  );

  const handleNetworkError = useCallback(
    (error: unknown) => {
      console.error('Network error:', error);

      const parsedError = parseAptosError(error);

      if (parsedError.code === 'NETWORK_TIMEOUT') {
        notifyWarning('Connection Issue', 'Network timeout - checking connection...');
      } else {
        notifyError('Network Error', 'Unable to connect to Aptos network');
      }

      return parsedError;
    },
    [parseAptosError, notifyError, notifyWarning],
  );

  return {
    handleError,
    handleTransactionError,
    handleWalletError,
    handleNetworkError,
    parseAptosError,
  };
}
