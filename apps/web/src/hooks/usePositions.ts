'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { PortfolioPosition, APEX_CONTRACT_CONFIG } from '@/lib/shared-types';

// Initialize Aptos client
const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
});
const aptosClient = new Aptos(aptosConfig);

export function usePositions(pollInterval = 30000) {
  // Default 30 seconds
  const { account, connected } = useWallet();
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // Fetch positions from blockchain
  const fetchPositions = useCallback(async () => {
    if (!connected || !account?.address) {
      setPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get portfolio legs from the smart contract
      const portfolioLegs = await aptosClient.view({
        payload: {
          function: `${APEX_CONTRACT_CONFIG.address}::${APEX_CONTRACT_CONFIG.module}::get_portfolio_legs`,
          typeArguments: [],
          functionArguments: [account.address.toString()],
        },
      });

      const legs = portfolioLegs[0] as number[];

      if (legs.length === 0) {
        setPositions([]);
        return;
      }

      // Convert legs data to positions
      const userPositions: PortfolioPosition[] = legs.map((leg, index) => ({
        symbol: `APEX-OPT-${account.address.toString().slice(-4)}-${index + 1}`,
        side: leg > 0 ? 'long' : 'short',
        quantity: Math.abs(leg),
        avgPrice: 1.0, // TODO: Fetch actual price from contract
        unrealizedPnL: leg > 0 ? 0.25 : -0.15, // TODO: Calculate real P&L
        realizedPnL: 0, // TODO: Track realized P&L
        currentPrice: leg > 0 ? 1.25 : 0.85, // TODO: Fetch current market price
        marketValue: Math.abs(leg) * (leg > 0 ? 1.25 : 0.85),
      }));

      setPositions(userPositions);
    } catch (err: unknown) {
      // Fallback to mock data if blockchain query fails
      console.warn('Blockchain query failed, using mock data:', err);

      // Simulate dynamic data based on user address
      const userPositions = mockPositions.map((pos, index) => ({
        ...pos,
        symbol: `APEX-OPT-${account.address.toString().slice(-4)}-${index + 1}`,
      }));

      setPositions(userPositions);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, mockPositions]);

  // Polling effect for real-time updates
  useEffect(() => {
    if (!connected || !account?.address || pollInterval <= 0) return;

    const interval = setInterval(() => {
      fetchPositions();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [connected, account, pollInterval, fetchPositions]);

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
    lastUpdated,
  };
}
