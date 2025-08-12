import { StrategyBuilder } from '@/components/trade/StrategyBuilder';
import { OrderTicket } from '@/components/trade/OrderTicket';
import { OrderBook } from '@/components/trade/OrderBook';
import { Candles } from '@/components/charts/Candles';
import { Depth } from '@/components/charts/Depth';
import { Tape } from '@/components/trade/Tape';
import { HeatmapBook } from '@/components/trade/HeatmapBook';

export default function TradePage() {
  const candles = Array.from({ length: 120 }).map((_, i) => {
    const base = 10 + Math.sin(i / 8) * 1.2 + Math.random() * 0.3;
    const open = base + (Math.random() - 0.5) * 0.3;
    const close = base + (Math.random() - 0.5) * 0.3;
    const high = Math.max(open, close) + Math.random() * 0.4;
    const low = Math.min(open, close) - Math.random() * 0.4;
    return { time: i, open, high, low, close };
  });
  const bids = Array.from({ length: 20 }).map((_, i) => ({ x: i, y: 100 - i * 4 }));
  const asks = Array.from({ length: 20 }).map((_, i) => ({ x: i, y: 80 - i * 3 }));
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section className="xl:col-span-2 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Chart</h2>
        <Candles data={candles} />
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Depth</h3>
          <Depth bids={bids} asks={asks} />
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Ticket</h2>
        <OrderTicket />
      </section>
      <section className="xl:col-span-3 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Order Book</h2>
        <OrderBook />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
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
      <section className="xl:col-span-3 rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Strategy Builder</h2>
        <StrategyBuilder />
      </section>
    </div>
  );
}
