import React from 'react';
import { SplineCanvas } from '@/components/three/SplineCanvas';

export function Architecture() {
  return (
    <section id="architecture" className="container py-16">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">Architecture</h2>
          <p className="mt-2 text-zinc-300">
            Apex separates matching, risk checks, and settlement into isolated modules running in
            parallel. Batches commit atomically to Aptos for deterministic settlement and sub-second
            finality.
          </p>
          <ul className="mt-6 space-y-2 text-zinc-300">
            <li>• Sharded orderbooks per instrument for horizontal scale</li>
            <li>• Deterministic batcher ensures cross-leg atomicity</li>
            <li>• On-chain risk engine for margin and collateralization</li>
            <li>• Auditable logs and analytics for market operations</li>
          </ul>
        </div>
        <div>
          {/* Replace with your Spline scene URL */}
          <SplineCanvas sceneUrl="https://prod.spline.design/placeholder/scene.splinecode" />
        </div>
      </div>
    </section>
  );
}
