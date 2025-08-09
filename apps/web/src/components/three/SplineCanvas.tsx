'use client';

import React from 'react';

export function SplineCanvas({ sceneUrl }: { sceneUrl: string }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400">
        <div>3D preview placeholder — provide a Spline scene URL to enable live canvas</div>
        <div className="text-xs text-zinc-500">{sceneUrl}</div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
