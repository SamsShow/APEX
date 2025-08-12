import { AptPriceTicker } from '@/components/markets/AptPriceTicker';
import { TOP_MOVERS, MARKET_FEED } from '@/mocks/markets';
import { Candles } from '@/components/charts/Candles';

export default function MarketsPage() {
  const candles = Array.from({ length: 200 }).map((_, i) => {
    const base = 10 + Math.sin(i / 10) * 1.4 + Math.random() * 0.4;
    const open = base + (Math.random() - 0.5) * 0.3;
    const close = base + (Math.random() - 0.5) * 0.3;
    const high = Math.max(open, close) + Math.random() * 0.4;
    const low = Math.min(open, close) - Math.random() * 0.4;
    return { time: i, open, high, low, close };
  });
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Live Ticker</h2>
        <div className="mt-3">
          <AptPriceTicker />
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">APT Candles</h3>
          <Candles data={candles} />
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Top Movers</h2>
        <div className="mt-3 space-y-2 text-sm">
          {TOP_MOVERS.map((m) => (
            <div key={m.symbol} className="flex items-center justify-between text-zinc-300">
              <span>{m.symbol}</span>
              <span className={m.changePct >= 0 ? 'text-green-400' : 'text-red-400'}>
                {m.changePct >= 0 ? '+' : ''}
                {m.changePct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-3">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Market Feed</h2>
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          {MARKET_FEED.map((e) => (
            <div key={e.id} className="flex items-center justify-between">
              <span>{e.title}</span>
              <span className="text-xs text-zinc-500">{e.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
