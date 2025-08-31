'use client';

import React from 'react';
import { useOrderBookWebSocket } from '@/hooks/useWebSocket';

interface OrderBookEntry {
  price: number;
  size: number;
  side: 'bid' | 'ask';
}

export function OrderBook() {
  const { orderBook, isConnected, connectionStatus } = useOrderBookWebSocket('APT/USD');

  // Combine bids and asks into a single array for display
  const orderBookData: OrderBookEntry[] = React.useMemo(() => {
    const bids = orderBook.bids.map(([price, size]) => ({
      price,
      size,
      side: 'bid' as const,
    }));

    const asks = orderBook.asks.map(([price, size]) => ({
      price,
      size,
      side: 'ask' as const,
    }));

    // Show top 10 bids and top 10 asks
    return [...bids.slice(0, 10), ...asks.slice(0, 10)];
  }, [orderBook]);

  return (
    <div className="h-64 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="grid grid-cols-3 border-b border-zinc-700 text-xs text-zinc-400">
        <div className="px-3 py-2">Price</div>
        <div className="px-3 py-2">Size</div>
        <div className="px-3 py-2">Side</div>
      </div>
      <div className="max-h-56 overflow-auto">
        {connectionStatus !== 'connected' ? (
          <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Disconnected'}
            {connectionStatus === 'error' && 'Connection Error'}
          </div>
        ) : orderBookData.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
            No orderbook data
          </div>
        ) : (
          orderBookData.map((order, index) => (
            <div
              key={`${order.side}-${order.price}-${index}`}
              className="grid grid-cols-3 text-sm hover:bg-zinc-800/30"
            >
              <div
                className={`px-3 py-2 font-mono ${
                  order.side === 'bid' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                ${order.price.toFixed(2)}
              </div>
              <div className="px-3 py-2 text-zinc-300 font-mono">{order.size.toLocaleString()}</div>
              <div
                className={`px-3 py-2 font-medium ${
                  order.side === 'bid' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {order.side.toUpperCase()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Connection status indicator */}
      <div className="border-t border-zinc-700 px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-400'
                : connectionStatus === 'connecting'
                  ? 'bg-yellow-400 animate-pulse'
                  : 'bg-red-400'
            }`}
          ></div>
          <span className="text-zinc-500 capitalize">{connectionStatus}</span>
          <span className="text-zinc-600 ml-auto">
            {orderBook.lastUpdated
              ? new Date(orderBook.lastUpdated).toLocaleTimeString()
              : '--:--:--'}
          </span>
        </div>
      </div>
    </div>
  );
}
