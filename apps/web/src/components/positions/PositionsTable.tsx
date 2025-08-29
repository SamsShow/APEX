'use client';

import React from 'react';
import { usePositions } from '@/hooks/usePositions';

export function PositionsTable() {
  const { positions, isLoading, error, refreshPositions } = usePositions();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-zinc-400">Loading positions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-red-400">
          Error loading positions: {error}
          <button
            onClick={refreshPositions}
            className="ml-4 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <div className="p-8 text-center text-zinc-400">
          No positions found. Create some options to see them here.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="grid grid-cols-6 border-b border-white/10 text-xs text-zinc-400">
        <div className="px-3 py-2">Symbol</div>
        <div className="px-3 py-2">Side</div>
        <div className="px-3 py-2">Qty</div>
        <div className="px-3 py-2">Avg Price</div>
        <div className="px-3 py-2">Current</div>
        <div className="px-3 py-2">PnL</div>
      </div>
      {positions.map((position) => (
        <div
          key={position.symbol}
          className="grid grid-cols-6 text-sm border-b border-white/5 last:border-b-0"
        >
          <div className="px-3 py-2 text-zinc-300">{position.symbol}</div>
          <div className="px-3 py-2 text-zinc-300 capitalize">{position.side}</div>
          <div className="px-3 py-2 text-zinc-300">{position.quantity}</div>
          <div className="px-3 py-2 text-zinc-300">${position.avgPrice.toFixed(2)}</div>
          <div className="px-3 py-2 text-zinc-300">
            ${position.currentPrice?.toFixed(2) || 'N/A'}
          </div>
          <div
            className={`px-3 py-2 ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center p-3 bg-zinc-900/50 text-xs text-zinc-400">
        <div>
          {positions.length} position{positions.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={refreshPositions}
          className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
