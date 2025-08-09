'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import and define the Spline web component (client-only)
const SplineViewer = dynamic(
  () =>
    import('@splinetool/viewer').then(() => {
      return {
        default: () => (
          <spline-viewer
            loading="lazy"
            style={{ width: '100%', height: '100%' }}
            url="https://prod.spline.design/4nta309VBD1dc1OZ/scene.splinecode"
          />
        ),
      };
    }),
  { ssr: false },
);

export function SplineCanvas() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SplineViewer />
    </div>
  );
}
