'use client';

import React from 'react';

type Row = { symbol: string; last: number; changePct: number; points: number[] };

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const norm = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - ((p - min) / Math.max(1e-6, max - min)) * 100;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 100" className="h-6 w-16">
      <polyline points={norm.join(' ')} fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function Watchlist() {
  const rows: Row[] = React.useMemo(
    () => [
      {
        symbol: 'APT',
        last: 10.82,
        changePct: 1.24,
        points: Array.from(
          { length: 20 },
          (_, i) => 10 + Math.sin(i / 3) * 0.3 + Math.random() * 0.1,
        ),
      },
      {
        symbol: 'APEX-OPT-1',
        last: 1.12,
        changePct: -0.8,
        points: Array.from(
          { length: 20 },
          (_, i) => 1 + Math.sin(i / 3) * 0.05 + Math.random() * 0.02,
        ),
      },
      {
        symbol: 'APEX-OPT-2',
        last: 0.92,
        changePct: 0.3,
        points: Array.from(
          { length: 20 },
          (_, i) => 0.9 + Math.cos(i / 4) * 0.06 + Math.random() * 0.02,
        ),
      },
    ],
    [],
  );
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur">
      <div className="mb-2 text-sm font-semibold text-zinc-200">Watchlist</div>
      <div className="space-y-1 text-sm">
        {rows.map((r) => (
          <div
            key={r.symbol}
            className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-zinc-300">{r.symbol}</span>
              <span className="text-xs text-zinc-500">{r.last.toFixed(3)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={r.changePct >= 0 ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}
              >
                {r.changePct >= 0 ? '+' : ''}
                {r.changePct.toFixed(2)}%
              </span>
              <span className="text-zinc-400">
                <Sparkline points={r.points} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
