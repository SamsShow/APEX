import { OrdersTable } from '@/components/orders/OrdersTable';

export default function OrdersPage() {
  return (
    <div className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
      <h2 className="mb-4 text-sm font-semibold text-zinc-200">Order History</h2>
      <OrdersTable />
    </div>
  );
}
