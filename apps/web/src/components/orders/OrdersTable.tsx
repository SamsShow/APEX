'use client';

import React from 'react';
import { useOrders } from '@/hooks/useOrders';
import { CancelOrderButton } from './CancelOrderButton';

export function OrdersTable() {
  const { orders, isLoading, error, refreshOrders, orderStats } = useOrders();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 backdrop-blur-sm metallic-texture">
        <div className="p-8 text-center text-zinc-400">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 backdrop-blur-sm metallic-texture">
        <div className="p-8 text-center text-red-400">
          Error loading orders: {error}
          <button
            onClick={refreshOrders}
            className="ml-4 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 backdrop-blur-sm metallic-texture">
        <div className="p-8 text-center text-zinc-400">
          No orders found. Create some options to see your order history here.
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'create_option':
        return 'Create Option';
      case 'cancel_option':
        return 'Cancel Option';
      case 'exercise_option':
        return 'Exercise Option';
      case 'create_series':
        return 'Create Series';
      default:
        return type;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
      {/* Order Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-zinc-900/30 border-b border-white/10">
        <div className="text-center">
          <div className="text-lg font-semibold text-zinc-200">{orderStats.total}</div>
          <div className="text-xs text-zinc-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-400">{orderStats.pending}</div>
          <div className="text-xs text-zinc-400">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{orderStats.confirmed}</div>
          <div className="text-xs text-zinc-400">Confirmed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-400">{orderStats.failed}</div>
          <div className="text-xs text-zinc-400">Failed</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 border-b border-white/10 text-xs text-zinc-400 min-w-[800px]">
          <div className="px-3 py-2">Type</div>
          <div className="px-3 py-2">Status</div>
          <div className="px-3 py-2">Details</div>
          <div className="px-3 py-2">Time</div>
          <div className="px-3 py-2">Tx Hash</div>
          <div className="px-3 py-2">Gas</div>
          <div className="px-3 py-2">Actions</div>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-7 text-sm border-b border-white/5 last:border-b-0 min-w-[800px]"
          >
            <div className="px-3 py-3 text-zinc-300">{getTypeLabel(order.type)}</div>

            <div className={`px-3 py-3 font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>

            <div className="px-3 py-3 text-zinc-400 text-xs">
              {order.details.optionType && <div>{order.details.optionType.toUpperCase()}</div>}
              {order.details.strikePrice && <div>${order.details.strikePrice}</div>}
              {order.details.quantity && <div>Qty: {order.details.quantity}</div>}
              {order.details.settlementPrice && <div>Settle: ${order.details.settlementPrice}</div>}
            </div>

            <div className="px-3 py-3 text-zinc-400 text-xs">
              {formatTimestamp(order.timestamp)}
            </div>

            <div className="px-3 py-3 text-zinc-400 text-xs font-mono">
              {order.txHash ? (
                <a
                  href={`https://explorer.aptoslabs.com/txn/${order.txHash}?network=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {order.txHash.slice(0, 10)}...
                </a>
              ) : (
                <span className="text-zinc-500">-</span>
              )}
            </div>

            <div className="px-3 py-3 text-zinc-400 text-xs">{order.gasUsed || '-'}</div>

            <div className="px-3 py-3">
              {order.errorMessage && (
                <div className="text-red-400 text-xs" title={order.errorMessage}>
                  Error
                </div>
              )}
              {order.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <div className="text-yellow-400 text-xs animate-pulse">Processing...</div>
                  <CancelOrderButton order={order} onOrderUpdate={refreshOrders} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-3 bg-zinc-900/50 text-xs text-zinc-400">
        <div>
          Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={refreshOrders}
          className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
