'use client';

import React from 'react';
import { SplineCanvas } from '../three/SplineCanvas';

export function Architecture() {
  return (
    <section className="container py-16">
      <h2 className="text-2xl font-semibold text-white">Architecture</h2>
      <p className="mt-2 max-w-2xl text-zinc-300">
        Apex separates matching, risk checks, and settlement into isolated modules running in
        parallel. Batches commit atomically to Aptos for deterministic settlement and sub-second
        finality.
      </p>
      <ul className="mt-4 space-y-2 text-zinc-300">
        <li>• Sharded orderbooks per instrument for horizontal scale</li>
        <li>• Deterministic batcher ensures cross-leg atomicity</li>
        <li>• On-chain risk engine for margin and collateralization</li>
        <li>• Auditable logs and analytics for market operations</li>
      </ul>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          {/* Replace with your Spline scene URL */}
          <SplineCanvas />
        </div>
      </div>
    </section>
  );
}
