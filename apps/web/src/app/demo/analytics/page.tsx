'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity, Target, Play } from 'lucide-react';

// Mock analytics data
const analyticsData = {
  performance: {
    totalReturn: 2340.5,
    annualizedReturn: 156.8,
    sharpeRatio: 2.34,
    maxDrawdown: -8.2,
    winRate: 78.5,
    totalTrades: 156,
  },
  monthlyReturns: [
    { month: 'Jan', return: 12.5 },
    { month: 'Feb', return: 8.3 },
    { month: 'Mar', return: -3.2 },
    { month: 'Apr', return: 15.7 },
    { month: 'May', return: 9.8 },
    { month: 'Jun', return: 11.2 },
  ],
};

export default function DemoAnalyticsPage() {
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
          <span className="text-green-400 font-medium">Analytics Demo Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Performance Analytics</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Comprehensive analytics dashboard with real-time performance tracking and risk metrics.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {[
          {
            label: 'Total Return',
            value: `$${analyticsData.performance.totalReturn.toFixed(2)}`,
            icon: TrendingUp,
            color: 'text-green-400',
          },
          {
            label: 'Annualized',
            value: `${analyticsData.performance.annualizedReturn.toFixed(1)}%`,
            icon: Activity,
            color: 'text-blue-400',
          },
          {
            label: 'Sharpe Ratio',
            value: analyticsData.performance.sharpeRatio.toFixed(2),
            icon: Target,
            color: 'text-purple-400',
          },
          {
            label: 'Max Drawdown',
            value: `${analyticsData.performance.maxDrawdown}%`,
            icon: TrendingUp,
            color: 'text-red-400',
          },
          {
            label: 'Win Rate',
            value: `${analyticsData.performance.winRate}%`,
            icon: Target,
            color: 'text-green-400',
          },
          {
            label: 'Total Trades',
            value: analyticsData.performance.totalTrades.toString(),
            icon: BarChart3,
            color: 'text-zinc-400',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center"
          >
            <metric.icon className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
            <div className="text-lg font-bold text-white mb-1">{metric.value}</div>
            <div className="text-xs text-zinc-400">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Monthly Returns</h2>
            <Badge variant="secondary" className="bg-green-400/10 text-green-400">
              +67.3% YTD
            </Badge>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-zinc-800/20 rounded-lg border border-zinc-700 flex items-center justify-center mb-6">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <div className="text-zinc-400">Interactive performance chart would be here</div>
              <div className="text-sm text-zinc-500">Monthly returns with benchmarks</div>
            </div>
          </div>

          {/* Monthly Data */}
          <div className="grid grid-cols-3 gap-4">
            {analyticsData.monthlyReturns.map((month, index) => (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-3 bg-zinc-800/30 rounded-lg"
              >
                <div className="text-sm font-medium text-white mb-1">{month.month}</div>
                <div
                  className={`text-lg font-bold ${
                    month.return >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {month.return >= 0 ? '+' : ''}
                  {month.return}%
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
