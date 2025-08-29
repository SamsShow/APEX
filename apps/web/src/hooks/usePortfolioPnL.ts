'use client';

import { useMemo } from 'react';
import { usePositions } from './usePositions';

// Local interface removed - using shared PortfolioPosition type
import { usePriceFeeds } from './usePriceFeeds';
import { useOptionsPricing } from './useOptionsPricing';

export interface PositionPnL {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface PortfolioPnLSummary {
  totalMarketValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPercent: number;
  totalRealizedPnL: number;
  totalPnL: number;
  totalPnLPercent: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  positionsCount: number;
  winningPositions: number;
  losingPositions: number;
  winRate: number;
  largestGain: number;
  largestLoss: number;
  averageWin: number;
  averageLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
}

export function usePortfolioPnL() {
  const { positions, isLoading: positionsLoading } = usePositions();
  const { prices, isLoading: pricesLoading } = usePriceFeeds();
  const { calculateOptionPrice } = useOptionsPricing();

  // Calculate P&L for individual positions
  const positionPnLs = useMemo((): PositionPnL[] => {
    if (positionsLoading || pricesLoading) return [];

    return positions.map((position) => {
      const currentPrice = prices['APT']?.price || 0; // Assuming APT as underlying for now

      // For options, calculate theoretical price
      let theoreticalPrice = currentPrice;
      if (
        position.symbol.includes('OPTION') ||
        position.symbol.includes('CALL') ||
        position.symbol.includes('PUT')
      ) {
        // Extract option details from symbol or position data
        const strikeMatch = position.symbol.match(/\$?(\d+(?:\.\d+)?)/);
        const strikePrice = strikeMatch ? parseFloat(strikeMatch[1]) : position.avgPrice;
        const isCall = position.symbol.includes('CALL') || position.symbol.includes('C');
        const expiryDays = 30; // Default expiry, should be calculated from actual data

        const optionPrice = calculateOptionPrice(
          'APT',
          strikePrice,
          expiryDays,
          isCall ? 'call' : 'put',
        );

        theoreticalPrice = optionPrice?.theoreticalPrice || currentPrice;
      }

      const marketValue = theoreticalPrice * Math.abs(position.quantity);
      const unrealizedPnL =
        position.side === 'long'
          ? (theoreticalPrice - position.avgPrice) * position.quantity
          : (position.avgPrice - theoreticalPrice) * position.quantity;

      const unrealizedPnLPercent =
        position.avgPrice !== 0
          ? (unrealizedPnL / (position.avgPrice * Math.abs(position.quantity))) * 100
          : 0;

      // Calculate Greeks (simplified for now)
      const delta = position.side === 'long' ? 0.6 : -0.6; // Simplified delta calculation
      const gamma = 0.05;
      const theta = position.side === 'long' ? -0.02 : 0.02; // Daily theta decay
      const vega = 0.15;
      const rho = 0.08;

      // Calculate daily P&L (simplified - in reality would use historical data)
      const dailyChangePercent = prices['APT']?.changePercent24h || 0;
      const dailyPnL = ((position.marketValue || 0) * dailyChangePercent) / 100;
      const dailyPnLPercent = dailyChangePercent;

      return {
        symbol: position.symbol,
        side: position.side,
        quantity: position.quantity,
        avgPrice: position.avgPrice,
        currentPrice: theoreticalPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dailyPnL,
        dailyPnLPercent,
        totalPnL: unrealizedPnL + position.realizedPnL,
        totalPnLPercent:
          position.avgPrice !== 0
            ? ((unrealizedPnL + position.realizedPnL) /
                (position.avgPrice * Math.abs(position.quantity))) *
              100
            : 0,
        delta,
        gamma,
        theta,
        vega,
        rho,
      };
    });
  }, [positions, prices, calculateOptionPrice, positionsLoading, pricesLoading]);

  // Calculate portfolio summary
  const portfolioSummary = useMemo((): PortfolioPnLSummary => {
    if (positionPnLs.length === 0) {
      return {
        totalMarketValue: 0,
        totalUnrealizedPnL: 0,
        totalUnrealizedPnLPercent: 0,
        totalRealizedPnL: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        dailyPnL: 0,
        dailyPnLPercent: 0,
        positionsCount: 0,
        winningPositions: 0,
        losingPositions: 0,
        winRate: 0,
        largestGain: 0,
        largestLoss: 0,
        averageWin: 0,
        averageLoss: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        volatility: 0,
      };
    }

    const totalMarketValue = positionPnLs.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalUnrealizedPnL = positionPnLs.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    const totalRealizedPnL = positionPnLs.reduce(
      (sum, pos) => sum + (pos.totalPnL - pos.unrealizedPnL),
      0,
    );
    const totalPnL = totalUnrealizedPnL + totalRealizedPnL;
    const totalUnrealizedPnLPercent =
      totalMarketValue !== 0 ? (totalUnrealizedPnL / totalMarketValue) * 100 : 0;
    const totalPnLPercent = totalMarketValue !== 0 ? (totalPnL / totalMarketValue) * 100 : 0;

    const dailyPnL = positionPnLs.reduce((sum, pos) => sum + pos.dailyPnL, 0);
    const dailyPnLPercent = totalMarketValue !== 0 ? (dailyPnL / totalMarketValue) * 100 : 0;

    const winningPositions = positionPnLs.filter((pos) => pos.unrealizedPnL > 0).length;
    const losingPositions = positionPnLs.filter((pos) => pos.unrealizedPnL < 0).length;
    const winRate = positionPnLs.length > 0 ? (winningPositions / positionPnLs.length) * 100 : 0;

    const gains = positionPnLs
      .filter((pos) => pos.unrealizedPnL > 0)
      .map((pos) => pos.unrealizedPnL);
    const losses = positionPnLs
      .filter((pos) => pos.unrealizedPnL < 0)
      .map((pos) => Math.abs(pos.unrealizedPnL));

    const largestGain = gains.length > 0 ? Math.max(...gains) : 0;
    const largestLoss = losses.length > 0 ? Math.max(...losses) : 0;
    const averageWin =
      gains.length > 0 ? gains.reduce((sum, gain) => sum + gain, 0) / gains.length : 0;
    const averageLoss =
      losses.length > 0 ? losses.reduce((sum, loss) => sum + loss, 0) / losses.length : 0;

    // Simplified calculations for advanced metrics
    const returns = positionPnLs.map((pos) => pos.totalPnLPercent);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const volatility =
      returns.length > 1
        ? Math.sqrt(
            returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) /
              (returns.length - 1),
          )
        : 0;

    const sharpeRatio = volatility !== 0 ? avgReturn / volatility : 0;

    // Max drawdown calculation (simplified)
    let peak = -Infinity;
    let maxDrawdown = 0;
    positionPnLs.forEach((pos) => {
      if (pos.marketValue > peak) peak = pos.marketValue;
      const drawdown = peak - pos.marketValue;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      totalMarketValue,
      totalUnrealizedPnL,
      totalUnrealizedPnLPercent,
      totalRealizedPnL,
      totalPnL,
      totalPnLPercent,
      dailyPnL,
      dailyPnLPercent,
      positionsCount: positionPnLs.length,
      winningPositions,
      losingPositions,
      winRate,
      largestGain,
      largestLoss,
      averageWin,
      averageLoss,
      sharpeRatio,
      maxDrawdown,
      volatility,
    };
  }, [positionPnLs]);

  // Get positions sorted by P&L
  const getPositionsByPnL = useMemo(() => {
    return (sortBy: 'gain' | 'loss' | 'value' = 'gain') => {
      const sorted = [...positionPnLs];
      switch (sortBy) {
        case 'gain':
          return sorted.sort((a, b) => b.unrealizedPnL - a.unrealizedPnL);
        case 'loss':
          return sorted.sort((a, b) => a.unrealizedPnL - b.unrealizedPnL);
        case 'value':
          return sorted.sort((a, b) => b.marketValue - a.marketValue);
        default:
          return sorted;
      }
    };
  }, [positionPnLs]);

  // Get positions by risk metrics
  const getHighRiskPositions = useMemo(() => {
    return positionPnLs
      .filter((pos) => Math.abs(pos.delta) > 0.5 || Math.abs(pos.gamma) > 0.1)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }, [positionPnLs]);

  // Calculate portfolio Greeks
  const portfolioGreeks = useMemo(() => {
    return {
      delta: positionPnLs.reduce((sum, pos) => sum + pos.delta * pos.quantity, 0),
      gamma: positionPnLs.reduce((sum, pos) => sum + pos.gamma * pos.quantity, 0),
      theta: positionPnLs.reduce((sum, pos) => sum + pos.theta * pos.quantity, 0),
      vega: positionPnLs.reduce((sum, pos) => sum + pos.vega * pos.quantity, 0),
      rho: positionPnLs.reduce((sum, pos) => sum + pos.rho * pos.quantity, 0),
    };
  }, [positionPnLs]);

  return {
    positionPnLs,
    portfolioSummary,
    portfolioGreeks,
    getPositionsByPnL,
    getHighRiskPositions,
    isLoading: positionsLoading || pricesLoading,
  };
}
