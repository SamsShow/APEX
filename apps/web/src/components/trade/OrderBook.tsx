'use client';

import React from 'react';
import { ORDERS } from '@/mocks/orders';

export function OrderBook() {
  return (
    <div className="h-64 overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="grid grid-cols-3 border-b border-white/10 text-xs text-zinc-400">
        <div className="px-3 py-2">Price</div>
        <div className="px-3 py-2">Size</div>
        <div className="px-3 py-2">Side</div>
      </div>
      <div className="max-h-56 overflow-auto">
        {ORDERS.map((o) => (
          <div key={o.id} className="grid grid-cols-3 text-sm">
            <div
              className={o.side === 'Buy' ? 'px-3 py-2 text-green-400' : 'px-3 py-2 text-red-400'}
            >
              {o.price.toFixed(2)}
            </div>
            <div className="px-3 py-2 text-zinc-300">{o.size}</div>
            <div className="px-3 py-2 text-zinc-300">{o.side === 'Buy' ? 'Bid' : 'Ask'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
