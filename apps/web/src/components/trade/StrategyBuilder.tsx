'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { StrategyPayoff } from '@/components/trade/StrategyPayoff';

type Leg = {
  id: string;
  type: 'Call' | 'Put';
  action: 'Buy' | 'Sell';
  strike: number;
  expiry: string;
  qty: number;
};

const PRESETS: Record<string, () => Leg[]> = {
  Straddle: () => [
    {
      id: crypto.randomUUID(),
      type: 'Call',
      action: 'Buy',
      strike: 10,
      expiry: '2024-12-31',
      qty: 1,
    },
    {
      id: crypto.randomUUID(),
      type: 'Put',
      action: 'Buy',
      strike: 10,
      expiry: '2024-12-31',
      qty: 1,
    },
  ],
  'Bull Call Spread': () => [
    {
      id: crypto.randomUUID(),
      type: 'Call',
      action: 'Buy',
      strike: 10,
      expiry: '2024-12-31',
      qty: 1,
    },
    {
      id: crypto.randomUUID(),
      type: 'Call',
      action: 'Sell',
      strike: 12,
      expiry: '2024-12-31',
      qty: 1,
    },
  ],
  'Iron Condor': () => [
    {
      id: crypto.randomUUID(),
      type: 'Call',
      action: 'Sell',
      strike: 12,
      expiry: '2024-12-31',
      qty: 1,
    },
    {
      id: crypto.randomUUID(),
      type: 'Call',
      action: 'Buy',
      strike: 14,
      expiry: '2024-12-31',
      qty: 1,
    },
    {
      id: crypto.randomUUID(),
      type: 'Put',
      action: 'Sell',
      strike: 8,
      expiry: '2024-12-31',
      qty: 1,
    },
    {
      id: crypto.randomUUID(),
      type: 'Put',
      action: 'Buy',
      strike: 6,
      expiry: '2024-12-31',
      qty: 1,
    },
  ],
};

export function StrategyBuilder() {
  const [legs, setLegs] = React.useState<Leg[]>([]);

  function addLeg(type: 'Call' | 'Put') {
    setLegs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type, action: 'Buy', strike: 10, expiry: '2024-12-31', qty: 1 },
    ]);
  }

  function applyPreset(name: keyof typeof PRESETS) {
    setLegs(PRESETS[name]());
  }

  function reset() {
    setLegs([]);
  }

  return (
    <div className="flex h-[420px] flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Strategy Legs</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => addLeg('Call')}>
            Add Call
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addLeg('Put')}>
            Add Put
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('Straddle')}>
            Straddle
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('Bull Call Spread')}>
            Spread
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('Iron Condor')}>
            Iron Condor
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-auto rounded-md border border-white/10 p-2">
        {legs.length === 0 ? (
          <div className="text-sm text-zinc-500">No legs yet. Add a leg or choose a preset.</div>
        ) : (
          legs.map((l) => (
            <div
              key={l.id}
              className="grid grid-cols-6 items-center gap-2 rounded-md bg-white/5 p-2 text-sm"
            >
              <div className="text-zinc-300">{l.action}</div>
              <div className="text-zinc-300">{l.type}</div>
              <div className="text-zinc-300">Strike: {l.strike}</div>
              <div className="text-zinc-300">Exp: {l.expiry}</div>
              <div className="text-zinc-300">Qty: {l.qty}</div>
              <div className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLegs((prev) => prev.filter((x) => x.id !== l.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="rounded-md border border-white/10 p-3">
        <StrategyPayoff legs={legs} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={reset}>
          Reset
        </Button>
        <Button size="sm">Review Order</Button>
      </div>
    </div>
  );
}
