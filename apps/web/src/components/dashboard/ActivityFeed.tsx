'use client';

import React from 'react';
import { ORDERS } from '@/mocks/orders';

export function ActivityFeed() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 p-3 backdrop-blur-sm metallic-texture">
      <div className="mb-2 text-sm font-semibold text-zinc-200">Recent Orders</div>
      <div className="space-y-1 text-sm text-zinc-300">
        {ORDERS.map((o) => (
          <div key={o.id} className="flex items-center justify-between">
            <span>
              {o.id} · {o.symbol}
            </span>
            <span className="text-xs text-zinc-500">{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
