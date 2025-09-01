'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demo
const demoStats = {
  portfolioValue: 15420.75,
  totalPnL: 2340.5,
  dailyPnL: 180.25,
  winRate: 78.5,
  activePositions: 12,
  totalOrders: 156,
};

const demoFeatures = [
  {
    title: 'Lightning Fast Trading',
    description: 'Sub-second execution with atomic settlement on Aptos',
    icon: Zap,
    stats: '0.3s avg execution',
    color: 'text-yellow-400',
  },
  {
    title: 'Advanced Analytics',
    description: 'Real-time portfolio analytics and risk management',
    icon: BarChart3,
    stats: '15+ metrics tracked',
    color: 'text-blue-400',
  },
  {
    title: 'Multi-Asset Options',
    description: 'Trade options across multiple underlying assets',
    icon: Target,
    stats: 'APT, BTC, ETH support',
    color: 'text-purple-400',
  },
  {
    title: 'Risk Management',
    description: 'Built-in risk controls and position monitoring',
    icon: Shield,
    stats: '99.9% uptime',
    color: 'text-green-400',
  },
];

const demoPositions = [
  { asset: 'APT Call 5.25', strike: 5.25, expiry: 'Feb 1', pnl: '+12.5%', value: 1250.0 },
  { asset: 'BTC Put 45000', strike: 45000, expiry: 'Feb 15', pnl: '-3.2%', value: 3200.0 },
  { asset: 'APT Call 6.00', strike: 6.0, expiry: 'Mar 1', pnl: '+8.7%', value: 870.0 },
  { asset: 'ETH Call 2800', strike: 2800, expiry: 'Feb 28', pnl: '+15.3%', value: 1530.0 },
];

export default function DemoPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 border border-green-400/20 mb-6"
        >
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">Demo Environment Active</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-6">
          Experience APEX Platform
        </h1>

        <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
          Explore all the powerful features of our hyper-fast options trading platform. This demo
          showcases real-time trading, portfolio management, analytics, and risk controls.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/demo/trade">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3">
              <Zap className="w-4 h-4 mr-2" />
              Start Trading Demo
            </Button>
          </Link>
          <Link href="/demo/portfolio">
            <Button variant="outline" className="border-zinc-600 hover:border-zinc-500 px-8 py-3">
              <PieChart className="w-4 h-4 mr-2" />
              View Portfolio Demo
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {[
          {
            label: 'Portfolio Value',
            value: `$${demoStats.portfolioValue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-400',
          },
          {
            label: 'Total P&L',
            value: `+$${demoStats.totalPnL.toFixed(2)}`,
            icon: TrendingUp,
            color: 'text-green-400',
          },
          {
            label: 'Daily P&L',
            value: `+$${demoStats.dailyPnL.toFixed(2)}`,
            icon: Activity,
            color: 'text-blue-400',
          },
          {
            label: 'Win Rate',
            value: `${demoStats.winRate}%`,
            icon: Target,
            color: 'text-purple-400',
          },
          {
            label: 'Active Positions',
            value: demoStats.activePositions.toString(),
            icon: BarChart3,
            color: 'text-yellow-400',
          },
          {
            label: 'Total Orders',
            value: demoStats.totalOrders.toString(),
            icon: Clock,
            color: 'text-zinc-400',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Key Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {demoFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
          >
            <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-400 text-sm mb-4">{feature.description}</p>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
              {feature.stats}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      {/* Demo Sections Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* Recent Positions */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Positions</h2>
            <Link href="/demo/portfolio">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {demoPositions.map((position, index) => (
              <motion.div
                key={position.asset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-white">{position.asset}</div>
                  <div className="text-sm text-zinc-400">
                    Strike: ${position.strike} | Expiry: {position.expiry}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">${position.value.toFixed(2)}</div>
                  <div
                    className={`text-sm ${position.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {position.pnl}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Demo Actions */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Explore Demo Features</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Live Trading Interface',
                description: 'Experience real-time order execution',
                href: '/demo/trade',
                icon: Zap,
              },
              {
                title: 'Market Data & Charts',
                description: 'Advanced charting and market analysis',
                href: '/demo/markets',
                icon: BarChart3,
              },
              {
                title: 'Portfolio Analytics',
                description: 'Comprehensive P&L and risk analysis',
                href: '/demo/analytics',
                icon: Activity,
              },
              {
                title: 'Order Management',
                description: 'View and manage all your orders',
                href: '/demo/orders',
                icon: Target,
              },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
              >
                <Link href={action.href}>
                  <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors group">
                    <action.icon className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{action.title}</div>
                      <div className="text-sm text-zinc-400">{action.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-center py-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Experience the Real Platform?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
          Connect your wallet and start trading with real assets on the Aptos blockchain. All the
          features you see in this demo are available in the live platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/app">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3">
              Launch Real App
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-zinc-600 hover:border-zinc-500 px-8 py-3">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
