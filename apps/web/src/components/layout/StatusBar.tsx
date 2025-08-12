'use client';

import React from 'react';
import { AptPriceTicker } from '@/components/markets/AptPriceTicker';

export function StatusBar() {
  return (
    <div className="sticky bottom-0 z-20 flex h-10 w-full items-center gap-4 border-t border-white/10 bg-black/40 px-4 text-xs text-zinc-400 backdrop-blur">
      <span className="hidden md:inline">Apex Testnet</span>
      <div className="ml-auto w-64">
        <AptPriceTicker />
      </div>
    </div>
  );
}
