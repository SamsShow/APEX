'use client';

import React from 'react';
import { usePythPrice, useFallbackAptPrice } from '@/lib/pyth';

// TODO: Replace with the official Pyth APT/USD price feed id
// Reference: https://pyth.network/price-feeds
const PYTH_APT_USD_FEED_ID = process.env.NEXT_PUBLIC_PYTH_APT_USD_ID || '0x';

export function AptPriceTicker() {
  const { price, lastUpdated } = usePythPrice(PYTH_APT_USD_FEED_ID || undefined);
  const fallback = useFallbackAptPrice(!price);
  const val = price ?? fallback;
  const formatted = val ? `$${Number(val).toFixed(3)}` : '—';
  const freshness = lastUpdated ? `${Math.round((Date.now() - lastUpdated) / 1000)}s ago` : '—';

  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <div className="text-sm text-zinc-400">APT / USD</div>
      <div className="flex items-baseline gap-3">
        <div className="text-lg font-semibold text-zinc-100">{formatted}</div>
        <div className="text-xs text-zinc-500">{freshness}</div>
      </div>
    </div>
  );
}
