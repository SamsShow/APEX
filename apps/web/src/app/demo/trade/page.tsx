'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, TrendingUp, DollarSign, CheckCircle2, AlertCircle, Play } from 'lucide-react';

// Mock data for demo trading
const mockOrders = [
  {
    id: '1',
    type: 'call',
    strike: 5.25,
    quantity: 100,
    expiry: 'Feb 1',
    status: 'filled',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'put',
    strike: 45000,
    quantity: 10,
    expiry: 'Feb 15',
    status: 'pending',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'call',
    strike: 6.0,
    quantity: 50,
    expiry: 'Mar 1',
    status: 'filled',
    timestamp: new Date(),
  },
];

export default function DemoTradePage() {
  const [strikePrice, setStrikePrice] = useState('5.50');
  const [quantity, setQuantity] = useState('100');
  const [optionType, setOptionType] = useState('call');
  const [expiryDays, setExpiryDays] = useState('30');
  const [orders, setOrders] = useState(mockOrders);

  const handleCreateOrder = () => {
    const newOrder = {
      id: Date.now().toString(),
      type: optionType,
      strike: parseFloat(strikePrice),
      quantity: parseInt(quantity),
      expiry: new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric' },
      ),
      status: 'pending' as const,
      timestamp: new Date(),
    };

    setOrders([newOrder, ...orders]);

    // Simulate order filling after 2 seconds
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === newOrder.id ? { ...order, status: 'filled' as const } : order,
        ),
      );
    }, 2000);
  };

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
          <span className="text-green-400 font-medium">Trading Demo Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Trading Interface</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Experience our lightning-fast trading platform. Create options, monitor positions, and
          execute trades with sub-second finality.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Ticket */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Create Option</h2>
            </div>

            {/* Demo Status */}
            <div className="flex items-center gap-2 p-3 rounded-lg border border-green-400/20 bg-green-400/5 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Demo Mode - Instant Execution</span>
            </div>

            <div className="space-y-4">
              {/* Option Type */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Option Type</label>
                <Select value={optionType} onValueChange={setOptionType}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call Option</SelectItem>
                    <SelectItem value="put">Put Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Strike Price */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Strike Price ($)</label>
                <Input
                  type="number"
                  placeholder="5.50"
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Quantity</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Expiry Period</label>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 Week</SelectItem>
                    <SelectItem value="30">1 Month</SelectItem>
                    <SelectItem value="90">3 Months</SelectItem>
                    <SelectItem value="180">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreateOrder}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!strikePrice || !quantity}
              >
                <Zap className="w-4 h-4 mr-2" />
                Create Option (Demo)
              </Button>
            </div>

            {/* Order Preview */}
            <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Order Preview</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Type:</span>
                  <span className="text-white capitalize">{optionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Strike:</span>
                  <span className="text-white">${strikePrice || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Quantity:</span>
                  <span className="text-white">{quantity || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Expiry:</span>
                  <span className="text-white">{expiryDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Est. Cost:</span>
                  <span className="text-green-400">$12.50</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Orders & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Orders', value: '12', icon: TrendingUp, color: 'text-blue-400' },
              { label: 'Total Volume', value: '$45.2K', icon: DollarSign, color: 'text-green-400' },
              { label: 'Avg Execution', value: '0.3s', icon: Zap, color: 'text-yellow-400' },
              {
                label: 'Success Rate',
                value: '99.9%',
                icon: CheckCircle2,
                color: 'text-purple-400',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <Card className="bg-zinc-900/50 border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <Badge variant="secondary" className="bg-green-400/10 text-green-400">
                Live Updates
              </Badge>
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.status === 'filled'
                          ? 'bg-green-400'
                          : order.status === 'pending'
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                      }`}
                    />
                    <div>
                      <div className="font-medium text-white">
                        {order.type.toUpperCase()} ${order.strike}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {order.quantity} contracts • Expires {order.expiry}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`${
                        order.status === 'filled'
                          ? 'bg-green-400/10 text-green-400'
                          : order.status === 'pending'
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-red-400/10 text-red-400'
                      }`}
                    >
                      {order.status}
                    </Badge>
                    <div className="text-xs text-zinc-500 mt-1">
                      {order.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-blue-400/5 border border-blue-400/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-400 mb-1">Demo Environment</h3>
                  <p className="text-xs text-zinc-400">
                    Orders are simulated and execute instantly. In the live platform, orders are
                    processed on the Aptos blockchain with atomic settlement and sub-second
                    finality.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
