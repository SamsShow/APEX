'use client';

import React from 'react';
import { AptPriceTicker } from '@/components/markets/AptPriceTicker';
import { TOP_MOVERS, MARKET_FEED } from '@/mocks/markets';

export function MarketsSnapshot() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <AptPriceTicker />
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="mb-2 text-sm font-semibold text-zinc-200">Top Movers</div>
          <div className="space-y-1 text-sm">
            {TOP_MOVERS.map((m) => (
              <div key={m.symbol} className="flex items-center justify-between text-zinc-300">
                <span>{m.symbol}</span>
                <span className={m.changePct >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {m.changePct >= 0 ? '+' : ''}
                  {m.changePct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <div className="mb-2 text-sm font-semibold text-zinc-200">Market Feed</div>
        <div className="space-y-2 text-sm text-zinc-300">
          {MARKET_FEED.map((e) => (
            <div key={e.id} className="flex items-center justify-between">
              <span>{e.title}</span>
              <span className="text-xs text-zinc-500">{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
