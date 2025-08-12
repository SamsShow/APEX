'use client';

import React from 'react';

export function HeatmapBook() {
  const rows = Array.from({ length: 20 }).map((_, i) => ({
    price: 10 + i * 0.02,
    bid: Math.floor(Math.random() * 200),
    ask: Math.floor(Math.random() * 200),
  }));
  const max = rows.reduce((m, r) => Math.max(m, r.bid, r.ask), 0) || 1;
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="grid grid-cols-3 border-b border-white/10 text-xs text-zinc-400">
        <div className="px-3 py-2">Price</div>
        <div className="px-3 py-2">Bid Depth</div>
        <div className="px-3 py-2">Ask Depth</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-3 text-sm">
          <div className="px-3 py-2 text-zinc-300">{r.price.toFixed(2)}</div>
          <div className="relative px-3 py-2 text-zinc-300">
            <div
              className="absolute inset-y-0 left-0 bg-green-500/20"
              style={{ width: `${(r.bid / max) * 100}%` }}
            />
            <span className="relative">{r.bid}</span>
          </div>
          <div className="relative px-3 py-2 text-zinc-300">
            <div
              className="absolute inset-y-0 right-0 bg-red-500/20"
              style={{ width: `${(r.ask / max) * 100}%` }}
            />
            <span className="relative">{r.ask}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
