'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, TrendingUp, DollarSign, BarChart3, Activity, Target, Play } from 'lucide-react';

// Mock portfolio data
const portfolioData = {
  totalValue: 15420.75,
  totalPnL: 2340.5,
  dailyPnL: 180.25,
  winRate: 78.5,
  positions: [
    {
      asset: 'APT Call 5.25',
      pnl: 1250.0,
      pnlPercent: 12.5,
      quantity: 100,
      strike: 5.25,
      expiry: 'Feb 1',
    },
    {
      asset: 'BTC Put 45000',
      pnl: -320.0,
      pnlPercent: -3.2,
      quantity: 10,
      strike: 45000,
      expiry: 'Feb 15',
    },
    {
      asset: 'APT Call 6.00',
      pnl: 870.0,
      pnlPercent: 8.7,
      quantity: 50,
      strike: 6.0,
      expiry: 'Mar 1',
    },
    {
      asset: 'ETH Call 2800',
      pnl: 1530.0,
      pnlPercent: 15.3,
      quantity: 25,
      strike: 2800,
      expiry: 'Feb 28',
    },
  ],
  assetAllocation: [
    { asset: 'APT', value: 8920.33, percentage: 57.8 },
    { asset: 'BTC', value: 3200.0, percentage: 20.8 },
    { asset: 'ETH', value: 1530.0, percentage: 9.9 },
    { asset: 'USDC', value: 1200.0, percentage: 7.8 },
    { asset: 'Others', value: 570.42, percentage: 3.7 },
  ],
};

export default function DemoPortfolioPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/20 mb-4">
          <Play className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">Portfolio Demo Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Portfolio Analytics</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Comprehensive portfolio management with real-time P&L tracking, risk analysis, and
          performance metrics.
        </p>
      </motion.div>

      {/* Portfolio Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          {
            label: 'Total Value',
            value: `$${portfolioData.totalValue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-400',
          },
          {
            label: 'Total P&L',
            value: `+$${portfolioData.totalPnL.toFixed(2)}`,
            icon: TrendingUp,
            color: 'text-green-400',
          },
          {
            label: 'Daily P&L',
            value: `+$${portfolioData.dailyPnL.toFixed(2)}`,
            icon: Activity,
            color: 'text-blue-400',
          },
          {
            label: 'Win Rate',
            value: `${portfolioData.winRate}%`,
            icon: Target,
            color: 'text-purple-400',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <metric.icon className={`w-8 h-8 ${metric.color} mb-3`} />
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-zinc-400">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Positions Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Positions</h2>
              <Badge variant="secondary" className="bg-blue-400/10 text-blue-400">
                {portfolioData.positions.length} Positions
              </Badge>
            </div>

            <div className="space-y-4">
              {portfolioData.positions.map((position, index) => (
                <motion.div
                  key={position.asset}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700"
                >
                  <div>
                    <div className="font-medium text-white">{position.asset}</div>
                    <div className="text-sm text-zinc-400">
                      {position.quantity} contracts • Strike ${position.strike} • Expires{' '}
                      {position.expiry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {position.pnlPercent >= 0 ? '+' : ''}
                      {position.pnlPercent.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Asset Allocation</h2>
            </div>

            <div className="space-y-4">
              {portfolioData.assetAllocation.map((asset, index) => (
                <motion.div
                  key={asset.asset}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    <div>
                      <div className="font-medium text-white">{asset.asset}</div>
                      <div className="text-sm text-zinc-400">{asset.percentage}% of portfolio</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${asset.value.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Allocation Chart Placeholder */}
            <div className="mt-6 p-8 bg-zinc-800/20 rounded-lg border border-zinc-700 flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                <div className="text-zinc-400">Interactive allocation chart would be here</div>
                <div className="text-sm text-zinc-500">Real-time portfolio visualization</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Sharpe Ratio', value: '2.34', description: 'Risk-adjusted returns' },
              { label: 'Max Drawdown', value: '-8.2%', description: 'Worst peak-to-trough' },
              { label: 'Beta', value: '0.87', description: 'Market correlation' },
              { label: 'Calmar Ratio', value: '1.92', description: 'Risk-adjusted metric' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center p-4 bg-zinc-800/30 rounded-lg"
              >
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-zinc-300 mb-1">{metric.label}</div>
                <div className="text-xs text-zinc-400">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
