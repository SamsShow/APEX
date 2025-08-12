import { ORDERS } from '@/mocks/orders';

export default function OrdersPage() {
  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-4 text-sm font-semibold text-zinc-200">Orders</h2>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="grid grid-cols-5 border-b border-white/10 bg-black/30 text-xs text-zinc-400">
          <div className="px-3 py-2">ID</div>
          <div className="px-3 py-2">Symbol</div>
          <div className="px-3 py-2">Side</div>
          <div className="px-3 py-2">Price</div>
          <div className="px-3 py-2">Status</div>
        </div>
        {ORDERS.map((o) => (
          <div key={o.id} className="grid grid-cols-5 text-sm">
            <div className="px-3 py-2 text-zinc-300">{o.id}</div>
            <div className="px-3 py-2 text-zinc-300">{o.symbol}</div>
            <div className="px-3 py-2 text-zinc-300">{o.side}</div>
            <div className="px-3 py-2 text-zinc-300">{o.price.toFixed(2)}</div>
            <div className="px-3 py-2 text-zinc-500">{o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
