'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

type ReactSplineProps = {
  scene: string;
  className?: string;
};

const SplineNext = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
});

export function ReactSpline({ scene, className }: ReactSplineProps) {
  return (
    <div className={cn('relative h-[360px] w-full md:h-[420px] lg:h-[520px]', className)}>
      <SplineNext scene={scene} />
    </div>
  );
}
