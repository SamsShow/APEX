'use client';

import React from 'react';
import { POSITIONS } from '@/mocks/positions';

export function PositionsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="grid grid-cols-5 border-b border-white/10 text-xs text-zinc-400">
        <div className="px-3 py-2">Symbol</div>
        <div className="px-3 py-2">Side</div>
        <div className="px-3 py-2">Qty</div>
        <div className="px-3 py-2">Avg Price</div>
        <div className="px-3 py-2">PnL</div>
      </div>
      {POSITIONS.map((p) => (
        <div key={p.symbol} className="grid grid-cols-5 text-sm">
          <div className="px-3 py-2 text-zinc-300">{p.symbol}</div>
          <div className="px-3 py-2 text-zinc-300">{p.side}</div>
          <div className="px-3 py-2 text-zinc-300">{p.qty}</div>
          <div className="px-3 py-2 text-zinc-300">{p.avgPrice.toFixed(2)}</div>
          <div className={p.pnl >= 0 ? 'px-3 py-2 text-green-400' : 'px-3 py-2 text-red-400'}>
            {p.pnl >= 0 ? '+' : ''}
            {p.pnl.toFixed(2)}$
          </div>
        </div>
      ))}
    </div>
  );
}
