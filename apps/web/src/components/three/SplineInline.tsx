'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

type InlineSplineProps = {
  scene: string;
  className?: string;
  showOverlay?: boolean;
};

export function InlineSpline({ scene, className, showOverlay = true }: InlineSplineProps) {
  // Ensure the custom element is defined on the client
  useEffect(() => {
    const load = async () => {
      try {
        await import('@splinetool/viewer');
      } catch (_) {
        // no-op
      }
    };
    load();
  }, []);
  return (
    <div
      className={cn(
        'relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl md:h-[460px] lg:h-[520px]',
        className,
      )}
    >
      {/* The Spline canvas fills the container */}
      <spline-viewer
        loading="eager"
        style={{ width: '100%', height: '100%', display: 'block' }}
        url={scene}
      />
      {/* Soft vignette to improve text contrast if overlapping */}
      {showOverlay ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
      ) : null}
    </div>
  );
}
