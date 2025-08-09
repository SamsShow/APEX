'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-xl border border-white/10 bg-gradient-to-b from-black/20 to-black/40 animate-pulse" />
  ),
});

export function SplineCanvas({ sceneUrl }: { sceneUrl: string }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Spline scene={sceneUrl} />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
