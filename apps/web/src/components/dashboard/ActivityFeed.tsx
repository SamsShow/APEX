'use client';

import React from 'react';
import { ORDERS } from '@/mocks/orders';

export function ActivityFeed() {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
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
