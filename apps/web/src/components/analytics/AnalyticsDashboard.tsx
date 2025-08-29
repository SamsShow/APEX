'use client';

import React, { useMemo } from 'react';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Award,
} from 'lucide-react';
// TODO: Import format when needed for date formatting
// import { format } from 'date-fns';

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const { portfolioSummary, positionPnLs } = usePortfolioPnL();
  const { transactions } = useTransactionHistory();

  // Calculate additional analytics
  const analytics = useMemo(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Filter transactions from last 30 days
    const recentTransactions = transactions.filter((tx) => tx.timestamp * 1000 >= thirtyDaysAgo);

    // Calculate performance metrics
    const winningTrades = recentTransactions.filter(
      (tx) => tx.type === 'create_option' && tx.status === 'success',
    ).length;

    const totalTrades = recentTransactions.filter((tx) => tx.type === 'create_option').length;

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Calculate average trade size
    const tradeSizes = recentTransactions
      .filter((tx) => tx.type === 'create_option' && tx.strikePrice && tx.quantity)
      .map((tx) => (tx.strikePrice || 0) * (tx.quantity || 0));

    const averageTradeSize =
      tradeSizes.length > 0
        ? tradeSizes.reduce((sum, size) => sum + size, 0) / tradeSizes.length
        : 0;

    // Calculate volatility (simplified)
    const dailyReturns = positionPnLs.map((pos) => pos.dailyPnLPercent);
    const avgDailyReturn =
      dailyReturns.length > 0
        ? dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length
        : 0;

    const volatility =
      dailyReturns.length > 1
        ? Math.sqrt(
            dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) /
              (dailyReturns.length - 1),
          )
        : 0;

    // Calculate Sharpe ratio (simplified, assuming 0% risk-free rate)
    const sharpeRatio = volatility > 0 ? avgDailyReturn / volatility : 0;

    // Calculate max drawdown
    let peak = -Infinity;
    let maxDrawdown = 0;
    let currentDrawdown = 0;

    positionPnLs.forEach((pos) => {
      if (pos.marketValue > peak) {
        peak = pos.marketValue;
        currentDrawdown = 0;
      } else {
        currentDrawdown = ((peak - pos.marketValue) / peak) * 100;
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }
    });

    return {
      winRate,
      averageTradeSize,
      volatility,
      sharpeRatio,
      maxDrawdown,
      totalTrades: recentTransactions.length,
      successfulTrades: recentTransactions.filter((tx) => tx.status === 'success').length,
      avgDailyReturn,
    };
  }, [transactions, positionPnLs]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-zinc-400';
  };

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-200">Trading Analytics</h2>
          <p className="text-zinc-400 mt-1">Performance metrics and trading insights</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          Last 30 Days
        </Badge>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Win Rate</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.winRate)}`}>
                  {analytics.winRate.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Sharpe Ratio</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(analytics.sharpeRatio)}`}>
                  {analytics.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Avg Trade Size</p>
                <p className="text-2xl font-bold text-zinc-200">
                  {formatCurrency(analytics.averageTradeSize)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Max Drawdown</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(-analytics.maxDrawdown)}`}>
                  {analytics.maxDrawdown.toFixed(1)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-zinc-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total P&L</span>
              <div
                className={`flex items-center gap-2 ${getPerformanceColor(portfolioSummary.totalPnL)}`}
              >
                {getPerformanceIcon(portfolioSummary.totalPnL)}
                <span className="font-semibold">{formatCurrency(portfolioSummary.totalPnL)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Daily P&L</span>
              <div
                className={`flex items-center gap-2 ${getPerformanceColor(portfolioSummary.dailyPnL)}`}
              >
                {getPerformanceIcon(portfolioSummary.dailyPnL)}
                <span className="font-semibold">{formatCurrency(portfolioSummary.dailyPnL)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Portfolio Value</span>
              <span className="font-semibold text-zinc-200">
                {formatCurrency(portfolioSummary.totalMarketValue)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Positions</span>
              <span className="font-semibold text-zinc-200">{portfolioSummary.positionsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-200">Trading Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Trades</span>
              <span className="font-semibold text-zinc-200">{analytics.totalTrades}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Successful Trades</span>
              <span className="font-semibold text-green-400">{analytics.successfulTrades}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Avg Daily Return</span>
              <div
                className={`flex items-center gap-2 ${getPerformanceColor(analytics.avgDailyReturn)}`}
              >
                {getPerformanceIcon(analytics.avgDailyReturn)}
                <span className="font-semibold">{formatPercent(analytics.avgDailyReturn)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Portfolio Volatility</span>
              <span className="font-semibold text-zinc-200">
                {analytics.volatility.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Top Performing Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {positionPnLs
              .sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent)
              .slice(0, 5)
              .map((position) => (
                <div key={position.symbol} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="font-medium text-zinc-200">{position.symbol}</div>
                      <div className="text-xs text-zinc-500">
                        {position.side.toUpperCase()} • {formatCurrency(position.avgPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getPerformanceColor(position.unrealizedPnL)}`}>
                      {formatCurrency(position.unrealizedPnL)}
                    </div>
                    <div
                      className={`text-xs ${getPerformanceColor(position.unrealizedPnLPercent)}`}
                    >
                      {formatPercent(position.unrealizedPnLPercent)}
                    </div>
                  </div>
                </div>
              ))}
            {positionPnLs.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No positions to analyze</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-200">Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-2xl font-bold text-zinc-200">
                {portfolioSummary.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-sm text-zinc-400">Sharpe Ratio</div>
            </div>

            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-2xl font-bold text-zinc-200">
                {analytics.volatility.toFixed(2)}%
              </div>
              <div className="text-sm text-zinc-400">Volatility</div>
            </div>

            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-2xl font-bold text-zinc-200">
                {portfolioSummary.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-zinc-400">Win Rate</div>
            </div>

            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-2xl font-bold text-zinc-200">
                {portfolioSummary.maxDrawdown.toFixed(1)}%
              </div>
              <div className="text-sm text-zinc-400">Max Drawdown</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
