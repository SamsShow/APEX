'use client';

import React from 'react';
// dynamic import inside effect
import { useResizeObserver } from './hooks';

export type DepthPoint = { x: number; y: number };

export function Depth({ bids, asks }: { bids: DepthPoint[]; asks: DepthPoint[] }) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const chartRef = React.useRef<{ remove: () => void } | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    (async () => {
      const { createChart, ColorType } = await import('lightweight-charts');
      if (!mounted || !ref.current) return;
      const chart = createChart(ref.current, {
        width: ref.current.clientWidth,
        height: 240,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#e5e7eb',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.06)' },
          horzLines: { color: 'rgba(255,255,255,0.06)' },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: { visible: false, borderVisible: false },
      });
      const bidsSeries = chart.addSeries('Line', {
        color: '#22c55e',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
      });
      const asksSeries = chart.addSeries('Line', {
        color: '#ef4444',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
      });
      bidsSeries.setData(bids.map((p) => ({ time: p.x, value: p.y })));
      asksSeries.setData(asks.map((p) => ({ time: p.x, value: p.y })));
      chartRef.current = chart;
    })();
    return () => {
      mounted = false;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [ref, bids, asks]);

  React.useEffect(() => {
    if (chartRef.current) chartRef.current.resize(size.width, 240);
  }, [size.width]);

  return <div ref={ref} className="h-[240px] w-full" />;
}
