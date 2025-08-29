'use client';

import React from 'react';
import { AdvancedOrderPanel } from '@/components/trade/AdvancedOrderPanel';

export default function AdvancedOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Advanced Orders</h1>
        <p className="text-zinc-400 mt-2">
          Place limit orders, stop orders, and other advanced order types
        </p>
      </div>

      <AdvancedOrderPanel />
    </div>
  );
}
