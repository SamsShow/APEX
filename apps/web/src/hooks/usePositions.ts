'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

import { PortfolioPosition } from '@/lib/shared-types';

export function usePositions() {
  const { account, connected } = useWallet();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock positions data for demonstration
  const mockPositions: PortfolioPosition[] = useMemo(
    () => [
      {
        symbol: 'APEX-OPT-1',
        side: 'long',
        quantity: 5,
        avgPrice: 1.25,
        unrealizedPnL: 12.5,
        realizedPnL: 0,
        currentPrice: 1.5,
        marketValue: 7.5,
      },
      {
        symbol: 'APEX-OPT-2',
        side: 'short',
        quantity: 3,
        avgPrice: 0.8,
        unrealizedPnL: -2.4,
        realizedPnL: 5.0,
        currentPrice: 0.72,
        marketValue: 2.16,
      },
      {
        symbol: 'APEX-OPT-3',
        side: 'long',
        quantity: 10,
        avgPrice: 2.0,
        unrealizedPnL: 25.0,
        realizedPnL: 0,
        currentPrice: 2.25,
        marketValue: 22.5,
      },
    ],
    [],
  );

  // Fetch positions from blockchain (mock implementation for now)
  const fetchPositions = useCallback(async () => {
    if (!connected || !account?.address) {
      setPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with real blockchain queries
      // For now, simulate fetching from blockchain with mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate dynamic data based on user address
      const userPositions = mockPositions.map((pos, index) => ({
        ...pos,
        symbol: `APEX-OPT-${account.address.toString().slice(-4)}-${index + 1}`,
      }));

      setPositions(userPositions);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions';
      setError(errorMessage);
      console.error('Error fetching positions:', errorMessage);
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, mockPositions]);

  // Refresh positions
  const refreshPositions = useCallback(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Auto-refresh positions when wallet connection changes
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Calculate portfolio summary
  const portfolioSummary = {
    totalValue: positions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0),
    totalUnrealizedPnL: positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0),
    totalRealizedPnL: positions.reduce((sum, pos) => sum + pos.realizedPnL, 0),
    totalPnL: positions.reduce((sum, pos) => sum + pos.unrealizedPnL + pos.realizedPnL, 0),
    positionCount: positions.length,
  };

  return {
    positions,
    isLoading,
    error,
    refreshPositions,
    portfolioSummary,
  };
}
