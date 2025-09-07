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

  if (error)
    return <div className="text-sm md:text-xs text-red-400 p-4 text-center">📊 {error}</div>;
  if (!candles) return <Skeleton className="h-[280px] md:h-[320px] w-full rounded-lg" />;
  return (
    <div className="relative">
      <Candles data={candles} />
      <div className="absolute top-2 right-2 text-xs text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded">
        📈 APT/USD
      </div>
    </div>
  );
}
