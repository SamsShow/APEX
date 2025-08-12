'use client';

import React from 'react';
import { Payoff } from '@/components/charts/Payoff';

export type Leg = {
  id: string;
  type: 'Call' | 'Put';
  action: 'Buy' | 'Sell';
  strike: number;
  expiry: string;
  qty: number;
  premium?: number; // optional, defaults to 0 for now
};

function payoffAtPrice(leg: Leg, spot: number): number {
  const sign = leg.action === 'Buy' ? 1 : -1;
  if (leg.type === 'Call') {
    return sign * Math.max(0, spot - leg.strike) * leg.qty - (leg.premium ?? 0) * leg.qty * sign;
  }
  return sign * Math.max(0, leg.strike - spot) * leg.qty - (leg.premium ?? 0) * leg.qty * sign;
}

export function StrategyPayoff({ legs }: { legs: Leg[] }) {
  const points = React.useMemo(() => {
    const minStrike = Math.min(...legs.map((l) => l.strike), 10);
    const maxStrike = Math.max(...legs.map((l) => l.strike), 10);
    const start = Math.max(1, Math.floor(minStrike - (maxStrike - minStrike)));
    const end = Math.ceil(maxStrike + (maxStrike - minStrike));
    const pts = [] as { x: number; y: number }[];
    for (let s = start; s <= end; s += Math.max(1, Math.floor((end - start) / 50))) {
      let total = 0;
      for (const leg of legs) {
        total += payoffAtPrice(leg, s);
      }
      pts.push({ x: s, y: total });
    }
    return pts;
  }, [legs]);

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-zinc-200">Payoff at Expiry</div>
      {points.length > 1 ? (
        <Payoff points={points} />
      ) : (
        <div className="text-sm text-zinc-500">Add legs to preview payoff.</div>
      )}
    </div>
  );
}
