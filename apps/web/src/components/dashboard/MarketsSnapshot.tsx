'use client';

import React from 'react';
import { AptPriceTicker } from '@/components/markets/AptPriceTicker';
import { TOP_MOVERS, MARKET_FEED } from '@/mocks/markets';

export const MarketsSnapshot = React.memo(() => {
  // Memoize the top movers rendering
  const topMoversContent = React.useMemo(
    () =>
      TOP_MOVERS.map((m) => (
        <div key={m.symbol} className="flex items-center justify-between text-zinc-300">
          <span>{m.symbol}</span>
          <span className={m.changePct >= 0 ? 'text-green-400' : 'text-red-400'}>
            {m.changePct >= 0 ? '+' : ''}
            {m.changePct.toFixed(2)}%
          </span>
        </div>
      )),
    [],
  );

  // Memoize the market feed rendering
  const marketFeedContent = React.useMemo(
    () =>
      MARKET_FEED.map((e) => (
        <div key={e.id} className="flex items-center justify-between">
          <span>{e.title}</span>
          <span className="text-xs text-zinc-500">{e.time}</span>
        </div>
      )),
    [],
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <AptPriceTicker />
        <div className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 p-3 backdrop-blur-sm metallic-texture">
          <div className="mb-2 text-sm font-semibold text-zinc-200">Top Movers</div>
          <div className="space-y-1 text-sm">{topMoversContent}</div>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 p-3 backdrop-blur-sm metallic-card">
        <div className="mb-2 text-sm font-semibold text-zinc-200">Market Feed</div>
        <div className="space-y-2 text-sm text-zinc-300">{marketFeedContent}</div>
      </div>
    </div>
  );
});

// Display name for debugging
MarketsSnapshot.displayName = 'MarketsSnapshot';
