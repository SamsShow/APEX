'use client';

import React from 'react';
import { Candles, type Candle } from '@/components/charts/Candles';
import { Skeleton } from '@/components/ui/skeleton';

export function AptCandles() {
  const [candles, setCandles] = React.useState<Candle[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/apt/ohlc');
        if (!res.ok) throw new Error('failed');
        const json = (await res.json()) as { candles: Candle[] };
        if (!cancelled) setCandles(json.candles);
      } catch (e) {
        if (!cancelled) setError('Failed to load APT candles');
      }
    }
    load();
    const t = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (error) return <div className="text-xs text-red-400">{error}</div>;
  if (!candles) return <Skeleton className="h-[320px] w-full" />;
  return <Candles data={candles} />;
}
