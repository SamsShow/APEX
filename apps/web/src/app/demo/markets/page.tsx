'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity, Play, Volume2 } from 'lucide-react';

// Mock market data
const marketData = [
  {
    symbol: 'APT/USD',
    price: 5.42,
    change: 2.34,
    changePercent: 2.34,
    volume: '1.2M',
    high: 5.67,
    low: 5.12,
    marketCap: '2.8B',
  },
  {
    symbol: 'BTC/USD',
    price: 45123.5,
    change: -234.2,
    changePercent: -0.52,
    volume: '45.6B',
    high: 45320.0,
    low: 44850.0,
    marketCap: '880B',
  },
  {
    symbol: 'ETH/USD',
    price: 2856.8,
    change: 45.6,
    changePercent: 1.62,
    volume: '18.9B',
    high: 2875.0,
    low: 2810.0,
    marketCap: '345B',
  },
];

const priceHistory = [
  { time: '09:00', price: 5.35 },
  { time: '10:00', price: 5.42 },
  { time: '11:00', price: 5.38 },
  { time: '12:00', price: 5.45 },
  { time: '13:00', price: 5.42 },
  { time: '14:00', price: 5.5 },
  { time: '15:00', price: 5.42 },
];

export default function DemoMarketsPage() {
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
          <span className="text-green-400 font-medium">Markets Demo Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Market Data</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Real-time price feeds, advanced charting, and comprehensive market analysis powered by
          Pyth Network.
        </p>
      </motion.div>

      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {marketData.map((market, index) => (
          <motion.div
            key={market.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{market.symbol}</h3>
              <div
                className={`flex items-center gap-1 ${
                  market.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {market.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {market.change >= 0 ? '+' : ''}
                  {market.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">${market.price.toLocaleString()}</div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-400">24h High</div>
                  <div className="text-white font-medium">${market.high.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-zinc-400">24h Low</div>
                  <div className="text-white font-medium">${market.low.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Volume</div>
                  <div className="text-white font-medium">{market.volume}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Market Cap</div>
                  <div className="text-white font-medium">${market.marketCap}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">APT/USD Price Chart</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-400/10 text-blue-400">
                Live Data
              </Badge>
              <Badge variant="secondary" className="bg-green-400/10 text-green-400">
                Pyth Oracle
              </Badge>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-zinc-800/20 rounded-lg border border-zinc-700 flex items-center justify-center mb-6">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <div className="text-zinc-400">Interactive candlestick chart would be here</div>
              <div className="text-sm text-zinc-500">
                Real-time price visualization with technical indicators
              </div>
            </div>
          </div>

          {/* Price History */}
          <div className="grid grid-cols-7 gap-4">
            {priceHistory.map((point, index) => (
              <motion.div
                key={point.time}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-3 bg-zinc-800/30 rounded-lg"
              >
                <div className="text-xs text-zinc-400 mb-1">{point.time}</div>
                <div className="text-sm font-medium text-white">${point.price.toFixed(2)}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Market Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Volume (24h)', value: '$65.7B', icon: Volume2, color: 'text-blue-400' },
          { label: 'Active Markets', value: '50+', icon: BarChart3, color: 'text-purple-400' },
          { label: 'Data Sources', value: '15+', icon: Activity, color: 'text-green-400' },
          { label: 'Update Frequency', value: '<1s', icon: TrendingUp, color: 'text-yellow-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Market Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Market Features</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time Price Feeds',
                description: 'Live price data from multiple exchanges with sub-second latency',
                features: [
                  'Pyth Network Integration',
                  'Multi-exchange aggregation',
                  'Real-time updates',
                ],
              },
              {
                title: 'Advanced Analytics',
                description: 'Technical indicators, volume analysis, and market sentiment',
                features: ['50+ indicators', 'Volume profile', 'Order flow analysis'],
              },
              {
                title: 'Risk Management',
                description: 'Comprehensive risk metrics and position monitoring',
                features: ['VaR calculations', 'Stress testing', 'Correlation analysis'],
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="p-4 bg-zinc-800/30 rounded-lg"
              >
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-xs text-zinc-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
