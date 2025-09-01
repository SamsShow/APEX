'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Filter,
  Search,
} from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    type: 'Call',
    symbol: 'APT/USD',
    strike: 5.25,
    quantity: 100,
    side: 'Buy',
    status: 'Filled',
    price: 12.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    expiry: '2024-02-01',
  },
  {
    id: 'ORD-002',
    type: 'Put',
    symbol: 'BTC/USD',
    strike: 45000,
    quantity: 10,
    side: 'Sell',
    status: 'Pending',
    price: 8.75,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    expiry: '2024-02-15',
  },
  {
    id: 'ORD-003',
    type: 'Call',
    symbol: 'ETH/USD',
    strike: 2800,
    quantity: 25,
    side: 'Buy',
    status: 'Filled',
    price: 15.3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    expiry: '2024-02-28',
  },
  {
    id: 'ORD-004',
    type: 'Put',
    symbol: 'APT/USD',
    strike: 5.0,
    quantity: 50,
    side: 'Sell',
    status: 'Cancelled',
    price: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    expiry: '2024-02-05',
  },
];

export default function DemoOrdersPage() {
  const [filter, setFilter] = useState('all');

  const filteredOrders =
    filter === 'all'
      ? mockOrders
      : mockOrders.filter((order) => order.status.toLowerCase() === filter);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'filled':
        return `${baseClasses} bg-green-400/10 text-green-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-400/10 text-yellow-400`;
      case 'cancelled':
        return `${baseClasses} bg-red-400/10 text-red-400`;
      default:
        return `${baseClasses} bg-zinc-400/10 text-zinc-400`;
    }
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
          <span className="text-green-400 font-medium">Orders Demo Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Order Management</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Complete order history, real-time status tracking, and comprehensive order management
          tools.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Orders', value: '156', icon: Target, color: 'text-blue-400' },
          { label: 'Filled', value: '142', icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pending', value: '8', icon: Clock, color: 'text-yellow-400' },
          { label: 'Cancelled', value: '6', icon: XCircle, color: 'text-red-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
            >
              <option value="all">All Orders</option>
              <option value="filled">Filled</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-400/10 text-green-400">
            Live Updates
          </Badge>
          <Button variant="outline" className="border-zinc-600 hover:border-zinc-500">
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Strike
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Side
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="hover:bg-zinc-800/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {order.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      ${order.strike}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.side === 'Buy'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-red-400/10 text-red-400'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {order.price > 0 ? `$${order.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {order.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <div className="text-zinc-400">No orders found matching your criteria</div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Order Types</h3>
          <div className="space-y-3">
            {[
              {
                type: 'Market Orders',
                description: 'Execute immediately at best available price',
                count: 89,
              },
              {
                type: 'Limit Orders',
                description: 'Execute only at specified price or better',
                count: 45,
              },
              {
                type: 'Stop Orders',
                description: 'Execute when price reaches stop level',
                count: 22,
              },
            ].map((orderType, index) => (
              <motion.div
                key={orderType.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg"
              >
                <div>
                  <div className="font-medium text-white">{orderType.type}</div>
                  <div className="text-sm text-zinc-400">{orderType.description}</div>
                </div>
                <Badge variant="secondary" className="bg-blue-400/10 text-blue-400">
                  {orderType.count}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Average Fill Time</span>
              <span className="text-white font-medium">0.8 seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Slippage (avg)</span>
              <span className="text-green-400 font-medium">-0.02%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Success Rate</span>
              <span className="text-green-400 font-medium">99.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Volume</span>
              <span className="text-white font-medium">$2.4M</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
