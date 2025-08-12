import { MarketsSnapshot } from '@/components/dashboard/MarketsSnapshot';
import { PortfolioCard } from '@/components/dashboard/PortfolioCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

export default function OverviewPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Markets Snapshot</h2>
        <div className="mt-3">
          <MarketsSnapshot />
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Your Portfolio</h2>
        <div className="mt-3">
          <PortfolioCard />
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-1 md:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Activity</h2>
        <div className="mt-3">
          <ActivityFeed />
        </div>
      </section>
    </div>
  );
}
