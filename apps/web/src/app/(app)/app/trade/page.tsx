'use client';

import { StrategyBuilder } from '@/components/trade/StrategyBuilder';
import { OrderTicket } from '@/components/trade/OrderTicket';
import { OrderBook } from '@/components/trade/OrderBook';
import { AptCandles } from '@/components/charts/AptCandles';
import { Depth } from '@/components/charts/Depth';
import { Tape } from '@/components/trade/Tape';
import { HeatmapBook } from '@/components/trade/HeatmapBook';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { usePositions } from '@/hooks/usePositions';
import { useOrders } from '@/hooks/useOrders';
import { useOrderBookWebSocket } from '@/hooks/useWebSocket';

export default function TradePage() {
  const { refreshPositions } = usePositions();
  const { refreshOrders } = useOrders();

  // WebSocket connections for real-time data
  const { orderBook } = useOrderBookWebSocket('APT/USD');

  // Convert orderbook data for Depth component
  const bids = orderBook.bids.map(([, quantity], index) => ({
    x: index,
    y: quantity,
  }));

  const asks = orderBook.asks.map(([, quantity], index) => ({
    x: index,
    y: quantity,
  }));
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
      <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Chart</h2>
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center text-red-400">Chart temporarily unavailable</div>
          }
        >
          <AptCandles />
        </ErrorBoundary>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Depth</h3>
          <ErrorBoundary
            fallback={<div className="p-4 text-center text-red-400">Depth chart unavailable</div>}
          >
            <Depth bids={bids} asks={asks} />
          </ErrorBoundary>
        </div>
      </section>
      <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Ticket</h2>
        <ErrorBoundary
          fallback={<div className="p-4 text-center text-red-400">Order ticket unavailable</div>}
        >
          <OrderTicket onPositionUpdate={refreshPositions} onOrderUpdate={refreshOrders} />
        </ErrorBoundary>
      </section>
      <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Book</h2>
        <ErrorBoundary
          fallback={<div className="p-4 text-center text-red-400">Order book unavailable</div>}
        >
          <OrderBook />
        </ErrorBoundary>
      </section>
      <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Flow</h2>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">Trade Tape</h3>
            <ErrorBoundary
              fallback={<div className="p-2 text-center text-red-400">Tape unavailable</div>}
            >
              <Tape />
            </ErrorBoundary>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">Mini Book Heatmap</h3>
            <ErrorBoundary
              fallback={<div className="p-2 text-center text-red-400">Heatmap unavailable</div>}
            >
              <HeatmapBook />
            </ErrorBoundary>
          </div>
        </div>
      </section>
      <section className="2xl:col-span-12 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Strategy Builder</h2>
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center text-red-400">Strategy builder unavailable</div>
          }
        >
          <StrategyBuilder />
        </ErrorBoundary>
      </section>
    </div>
  );
}
