'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function OrderTicket() {
  return (
    <div className="flex h-[420px] flex-col gap-3 rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="text-sm font-medium text-zinc-200">Order Ticket</div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-md border border-white/10 p-3 text-xs text-zinc-400">Price</div>
        <div className="rounded-md border border-white/10 p-3 text-xs text-zinc-400">Size</div>
        <div className="col-span-2 rounded-md border border-white/10 p-3 text-xs text-zinc-400">
          Time in Force
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Submit</Button>
      </div>
    </div>
  );
}
