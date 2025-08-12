import { StrategyBuilder } from '@/components/trade/StrategyBuilder';
import { OrderTicket } from '@/components/trade/OrderTicket';
import { OrderBook } from '@/components/trade/OrderBook';
import { AptCandles } from '@/components/charts/AptCandles';
import { Depth } from '@/components/charts/Depth';
import { Tape } from '@/components/trade/Tape';
import { HeatmapBook } from '@/components/trade/HeatmapBook';

export default function TradePage() {
  const bids = Array.from({ length: 20 }).map((_, i) => ({ x: i, y: 100 - i * 4 }));
  const asks = Array.from({ length: 20 }).map((_, i) => ({ x: i, y: 80 - i * 3 }));
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
      <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Chart</h2>
        <AptCandles />
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Depth</h3>
          <Depth bids={bids} asks={asks} />
        </div>
      </section>
      <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Ticket</h2>
        <OrderTicket />
      </section>
      <section className="2xl:col-span-8 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Book</h2>
        <OrderBook />
      </section>
      <section className="2xl:col-span-4 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Flow</h2>
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">Trade Tape</h3>
            <Tape />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-200">Mini Book Heatmap</h3>
            <HeatmapBook />
          </div>
        </div>
      </section>
      <section className="2xl:col-span-12 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Strategy Builder</h2>
        <StrategyBuilder />
      </section>
    </div>
  );
}
