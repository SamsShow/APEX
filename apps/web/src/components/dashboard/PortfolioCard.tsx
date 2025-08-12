'use client';

import React from 'react';
import { HOLDINGS, PNL_POINTS } from '@/mocks/portfolio';

export function PortfolioCard() {
  const total = HOLDINGS.reduce((s, h) => s + h.valueUsd, 0);
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="mb-2 text-sm font-semibold text-zinc-200">Portfolio</div>
      <div className="mb-3 text-2xl font-semibold text-zinc-100">${total.toFixed(2)}</div>
      <div className="grid grid-cols-3 gap-2 text-sm text-zinc-300">
        {HOLDINGS.map((h) => (
          <div key={h.asset} className="rounded-md border border-white/10 p-2">
            <div className="text-xs text-zinc-500">{h.asset}</div>
            <div>{h.amount}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-end gap-1">
        {PNL_POINTS.map((p) => (
          <div key={p.t} className="w-6 rounded bg-white/10" style={{ height: 20 + p.v / 60 }} />
        ))}
      </div>
    </div>
  );
}
