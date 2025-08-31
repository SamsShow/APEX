'use client';

import React from 'react';
import { useMounted } from '@/components/hooks/useMounted';
import { useTradesWebSocket } from '@/hooks/useWebSocket';

type Trade = {
  id: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: number;
};

export function Tape() {
  const { trades, isConnected, connectionStatus } = useTradesWebSocket('APT/USD');

  // Convert WebSocket trades to display format
  const displayTrades = React.useMemo(() => {
    return trades.slice(0, 20).map((trade: Trade) => ({
      id: trade.id,
      side: trade.side === 'buy' ? 'Buy' : 'Sell',
      price: trade.price,
      size: trade.quantity,
      time: new Date(trade.timestamp).toLocaleTimeString(),
    }));
  }, [trades]);

  const mounted = useMounted();
  if (!mounted) return <div className="h-48 rounded-lg border border-zinc-800 bg-zinc-900/50" />;

  return (
    <div className="h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
      <div className="grid grid-cols-4 border-b border-zinc-700 text-xs text-zinc-400">
        <div className="px-3 py-2">Time</div>
        <div className="px-3 py-2">Side</div>
        <div className="px-3 py-2">Price</div>
        <div className="px-3 py-2">Size</div>
      </div>

      {connectionStatus !== 'connected' ? (
        <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
          {connectionStatus === 'connecting' && 'Connecting...'}
          {connectionStatus === 'disconnected' && 'Disconnected'}
          {connectionStatus === 'error' && 'Connection Error'}
        </div>
      ) : displayTrades.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
          No recent trades
        </div>
      ) : (
        displayTrades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-4 text-sm hover:bg-zinc-800/30">
            <div className="px-3 py-2 text-zinc-500 font-mono text-xs">{trade.time}</div>
            <div
              className={`px-3 py-2 font-medium ${
                trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trade.side}
            </div>
            <div className="px-3 py-2 text-zinc-300 font-mono">${trade.price.toFixed(3)}</div>
            <div className="px-3 py-2 text-zinc-300 font-mono">{trade.size.toLocaleString()}</div>
          </div>
        ))
      )}

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
        </div>
      </div>
    </div>
  );
}
