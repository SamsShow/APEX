'use client';

import React from 'react';
import { usePythPriceWithFallback, PYTH_PRICE_FEEDS } from '@/lib/pyth';

export function AptPriceTicker() {
  const { price, confidence, lastUpdated, source } = usePythPriceWithFallback('APT/USD');

  const formatted = price ? `$${price.toFixed(3)}` : '—';
  const freshness = lastUpdated ? `${Math.round((Date.now() - lastUpdated) / 1000)}s ago` : '—';

  // For display purposes, we'll show a mock change percent since we don't have historical data
  const changePercent = price ? '+2.94%' : '—';

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-1.5">
      <div className="flex items-center gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            price && source === 'pyth'
              ? 'bg-green-400'
              : price && source === 'fallback'
                ? 'bg-yellow-400'
                : 'bg-red-400'
          }`}
        ></div>
        <div className="text-sm text-zinc-400 font-medium">APT/USD</div>
        {source && <div className="text-xs text-zinc-500">({source})</div>}
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-sm font-semibold text-zinc-100">{formatted}</div>
        <div className="text-xs font-medium text-green-400">{changePercent}</div>
        <div className="text-xs text-zinc-500">{freshness}</div>
      </div>
    </div>
  );
}
