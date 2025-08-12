'use client';

import React from 'react';
import { useMounted } from '@/components/hooks/useMounted';

type Trade = { id: string; side: 'Buy' | 'Sell'; price: number; size: number; time: string };

export function Tape() {
  const [trades, setTrades] = React.useState<Trade[]>(() =>
    Array.from({ length: 16 }).map((_, i) => ({
      id: `T-${1000 + i}`,
      side: i % 2 ? 'Buy' : 'Sell',
      price: 10 + Math.random(),
      size: Math.floor(Math.random() * 10) + 1,
      time: `${i + 1}m ago`,
    })),
  );

  React.useEffect(() => {
    const t = setInterval(() => {
      setTrades((prev) => {
        const next: Trade = {
          id: `T-${Math.floor(Math.random() * 10000)}`,
          side: Math.random() > 0.5 ? 'Buy' : 'Sell',
          price: 10 + Math.random(),
          size: Math.floor(Math.random() * 10) + 1,
          time: 'now',
        };
        return [next, ...prev].slice(0, 20);
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const mounted = useMounted();
  if (!mounted) return <div className="h-48 rounded-lg border border-white/10 bg-black/30" />;
  return (
    <div className="h-48 overflow-auto rounded-lg border border-white/10 bg-black/30">
      <div className="grid grid-cols-4 border-b border-white/10 text-xs text-zinc-400">
        <div className="px-3 py-2">Time</div>
        <div className="px-3 py-2">Side</div>
        <div className="px-3 py-2">Price</div>
        <div className="px-3 py-2">Size</div>
      </div>
      {trades.map((t) => (
        <div key={t.id} className="grid grid-cols-4 text-sm">
          <div className="px-3 py-2 text-zinc-500">{t.time}</div>
          <div className={t.side === 'Buy' ? 'px-3 py-2 text-green-400' : 'px-3 py-2 text-red-400'}>
            {t.side}
          </div>
          <div className="px-3 py-2 text-zinc-300">{t.price.toFixed(3)}</div>
          <div className="px-3 py-2 text-zinc-300">{t.size}</div>
        </div>
      ))}
    </div>
  );
}
