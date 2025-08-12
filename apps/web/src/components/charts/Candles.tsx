'use client';

import React from 'react';
// dynamic import inside effect to ensure client-only and proper chart API
import { useResizeObserver } from './hooks';

export type Candle = { time: number; open: number; high: number; low: number; close: number };

export function Candles({ data }: { data: Candle[] }) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  type ChartCandlesApi = {
    addCandlestickSeries: (opts?: Record<string, unknown>) => { setData: (d: Candle[]) => void };
    remove: () => void;
    resize: (w: number, h: number) => void;
  };
  const chartRef = React.useRef<ChartCandlesApi | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    (async () => {
      const { createChart, ColorType } = await import('lightweight-charts');
      if (!mounted || !ref.current) return;
      const chart = createChart(ref.current, {
        width: ref.current.clientWidth,
        height: 320,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#e5e7eb',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.06)' },
          horzLines: { color: 'rgba(255,255,255,0.06)' },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false },
        crosshair: { mode: 1 },
      }) as unknown as ChartCandlesApi & {
        addAreaSeries?: (opts?: Record<string, unknown>) => {
          setData: (d: { time: number; value: number }[]) => void;
        };
      };
      const chartLike = chart;
      if (typeof chartLike.addCandlestickSeries === 'function') {
        const series = chartLike.addCandlestickSeries({});
        series.setData(data);
      } else if (typeof chartLike.addAreaSeries === 'function') {
        const series = chartLike.addAreaSeries({
          lineColor: '#a1a1aa',
          topColor: 'rgba(161,161,170,0.15)',
          bottomColor: 'transparent',
        });
        series.setData(data.map((d) => ({ time: d.time, value: d.close })));
      }
      chartRef.current = chart;
    })();
    return () => {
      mounted = false;
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [ref, data]);

  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resize(size.width, 320);
    }
  }, [size.width]);

  return <div ref={ref} className="h-[320px] w-full" />;
}
