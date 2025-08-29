'use client';

import React from 'react';
import { StrategyBuilder } from '@/components/strategy/StrategyBuilder';

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Strategy Builder</h1>
        <p className="text-zinc-400 mt-2">
          Create complex multi-leg option strategies with real-time pricing and risk analysis
        </p>
      </div>

      <StrategyBuilder />
    </div>
  );
}
