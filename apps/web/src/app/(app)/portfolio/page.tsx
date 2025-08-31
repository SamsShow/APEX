'use client';

import React, { useState } from 'react';
import { usePortfolioPnL } from '@/hooks/usePortfolioPnL';
import { usePositions } from '@/hooks/usePositions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PositionsTable } from '@/components/positions/PositionsTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { MarketsSnapshot } from '@/components/dashboard/MarketsSnapshot';
import { PortfolioPerformanceChart } from '@/components/portfolio/PortfolioPerformanceChart';
import { AssetAllocationChart } from '@/components/portfolio/AssetAllocationChart';
import { TrendingUp, TrendingDown, DollarSign, Target, Shield, PieChart } from 'lucide-react';

export default function PortfolioPage() {
  const { portfolioSummary, portfolioGreeks, isLoading } = usePortfolioPnL();
  const { positions } = usePositions();
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'analytics'>('overview');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-zinc-800/50 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="h-16 bg-zinc-800/50 rounded animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'positions', label: 'Positions', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Portfolio</h1>
          <p className="text-zinc-400 mt-1">Track your options trading performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">Refresh Data</Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-zinc-900/50 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Total Value</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {formatCurrency(portfolioSummary.totalMarketValue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Unrealized P&L</p>
                  <p
                    className={`text-2xl font-bold ${
                      portfolioSummary.totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(portfolioSummary.totalUnrealizedPnL)}
                  </p>
                  <p
                    className={`text-sm ${
                      portfolioSummary.totalUnrealizedPnLPercent >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {formatPercent(portfolioSummary.totalUnrealizedPnLPercent)}
                  </p>
                </div>
                {portfolioSummary.totalUnrealizedPnL >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-400" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-400" />
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Daily P&L</p>
                  <p
                    className={`text-2xl font-bold ${
                      portfolioSummary.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(portfolioSummary.dailyPnL)}
                  </p>
                  <p
                    className={`text-sm ${
                      portfolioSummary.dailyPnLPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatPercent(portfolioSummary.dailyPnLPercent)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Win Rate</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {portfolioSummary.winRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-zinc-400">
                    {portfolioSummary.winningPositions}W / {portfolioSummary.losingPositions}L
                  </p>
                </div>
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
            </Card>
          </div>

          {/* Performance Chart */}
          <PortfolioPerformanceChart />

          {/* Charts and Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <AssetAllocationChart />

            {/* Risk Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Risk Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Sharpe Ratio</p>
                  <p className="text-lg font-semibold text-zinc-100">
                    {portfolioSummary.sharpeRatio.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Max Drawdown</p>
                  <p className="text-lg font-semibold text-red-400">
                    -{formatCurrency(portfolioSummary.maxDrawdown)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Volatility</p>
                  <p className="text-lg font-semibold text-zinc-100">
                    {portfolioSummary.volatility.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Largest Gain</p>
                  <p className="text-lg font-semibold text-green-400">
                    {formatCurrency(portfolioSummary.largestGain)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Portfolio Composition and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Composition */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Portfolio Composition</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Options Positions</span>
                  <Badge variant="secondary">
                    {
                      positions.filter(
                        (p) =>
                          p.symbol.includes('OPTION') ||
                          p.symbol.includes('CALL') ||
                          p.symbol.includes('PUT'),
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Spot Positions</span>
                  <Badge variant="secondary">
                    {
                      positions.filter(
                        (p) =>
                          !p.symbol.includes('OPTION') &&
                          !p.symbol.includes('CALL') &&
                          !p.symbol.includes('PUT'),
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total Positions</span>
                  <Badge variant="outline">{portfolioSummary.positionsCount}</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Recent Activity</h3>
            <ActivityFeed />
          </Card>
        </>
      )}

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-100">Positions</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
              </div>
            </div>
            <PositionsTable />
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Greeks Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Portfolio Greeks</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-sm text-zinc-400">Delta</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {portfolioGreeks.delta.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-sm text-zinc-400">Gamma</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {portfolioGreeks.gamma.toFixed(3)}
                </p>
              </div>
              <div className="text-center p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-sm text-zinc-400">Theta</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {portfolioGreeks.theta.toFixed(3)}
                </p>
              </div>
              <div className="text-center p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-sm text-zinc-400">Vega</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {portfolioGreeks.vega.toFixed(3)}
                </p>
              </div>
              <div className="text-center p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-sm text-zinc-400">Rho</p>
                <p className="text-2xl font-bold text-zinc-100">{portfolioGreeks.rho.toFixed(3)}</p>
              </div>
            </div>
          </Card>

          {/* Markets Snapshot */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Markets Overview</h3>
            <MarketsSnapshot />
          </Card>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-md font-semibold text-zinc-100 mb-4">Performance by Asset</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">APT Options</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Spot Trading</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-md font-semibold text-zinc-100 mb-4">Risk Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Value at Risk (95%)</span>
                  <span className="text-sm text-zinc-100">Coming Soon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Stress Test Results</span>
                  <span className="text-sm text-zinc-100">Coming Soon</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
