'use client';

import { HOLDINGS, PNL_POINTS } from '@/mocks/portfolio';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Suspense } from 'react';

function PortfolioHoldings() {
  const total = HOLDINGS.reduce((s, h) => s + h.valueUsd, 0);
  return (
    <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-2 text-sm font-semibold text-zinc-200">Holdings</h2>
      <div className="mt-3 text-2xl font-semibold text-zinc-100">${total.toFixed(2)}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-zinc-300">
        {HOLDINGS.map((h) => (
          <div key={h.asset} className="rounded-md border border-white/10 p-2">
            <div className="text-xs text-zinc-500">{h.asset}</div>
            <div>{h.amount}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortfolioPnL() {
  return (
    <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-2 text-sm font-semibold text-zinc-200">PnL</h2>
      <div className="mt-3 flex items-end gap-1">
        {PNL_POINTS.map((p) => (
          <div key={p.t} className="w-6 rounded bg-white/10" style={{ height: 20 + p.v / 60 }} />
        ))}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  return (
    <ErrorBoundary
      fallback={<div className="p-8 text-center text-red-400">Portfolio data unavailable</div>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ErrorBoundary
          fallback={<div className="p-4 text-center text-red-400">Holdings data unavailable</div>}
        >
          <Suspense fallback={<div className="p-4 text-center">Loading holdings...</div>}>
            <PortfolioHoldings />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary
          fallback={<div className="p-4 text-center text-red-400">PnL data unavailable</div>}
        >
          <Suspense fallback={<div className="p-4 text-center">Loading P&L...</div>}>
            <PortfolioPnL />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
