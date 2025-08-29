import { PositionsTable } from '@/components/positions/PositionsTable';

export default function PositionsPage() {
  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-4 text-sm font-semibold text-zinc-200">Portfolio Positions</h2>
      <PositionsTable />
    </div>
  );
}
