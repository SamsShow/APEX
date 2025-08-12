'use client';

import React from 'react';
// dynamic import inside effect
import { useResizeObserver } from './hooks';

export type PayoffPoint = { x: number; y: number };

export function Payoff({ points }: { points: PayoffPoint[] }) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  type ChartPayoffApi = {
    addLineSeries: (opts?: Record<string, unknown>) => {
      setData: (d: { time: number; value: number }[]) => void;
    };
    remove: () => void;
    resize: (w: number, h: number) => void;
  };
  const chartRef = React.useRef<ChartPayoffApi | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    (async () => {
      const { createChart, ColorType } = await import('lightweight-charts');
      if (!mounted || !ref.current) return;
      const chart = createChart(ref.current, {
        width: ref.current.clientWidth,
        height: 220,
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
      }) as unknown as ChartPayoffApi;
      const series = chart.addLineSeries({ color: '#60a5fa', lineWidth: 2 });
      series.setData(points.map((p) => ({ time: p.x, value: p.y })));
      chartRef.current = chart;
    })();
    return () => {
      mounted = false;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [ref, points]);

  React.useEffect(() => {
    if (chartRef.current) chartRef.current.resize(size.width, 220);
  }, [size.width]);

  return <div ref={ref} className="h-[220px] w-full" />;
}
