'use client';

import { MarketsSnapshot } from '@/components/dashboard/MarketsSnapshot';
import { usePositions } from '@/hooks/usePositions';
import { useOrders } from '@/hooks/useOrders';

export default function OverviewPage() {
  const { portfolioSummary, isLoading: positionsLoading } = usePositions();
  const { orderStats, isLoading: ordersLoading } = useOrders();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {/* Portfolio Summary */}
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-4 text-sm font-semibold text-zinc-200">Portfolio Overview</h2>
        {positionsLoading ? (
          <div className="text-center text-zinc-400 py-4">Loading...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Total Value</span>
              <span className="text-zinc-200 font-semibold">
                ${portfolioSummary.totalValue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Unrealized P&L</span>
              <span
                className={`font-semibold ${portfolioSummary.totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {portfolioSummary.totalUnrealizedPnL >= 0 ? '+' : ''}$
                {portfolioSummary.totalUnrealizedPnL.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Realized P&L</span>
              <span
                className={`font-semibold ${portfolioSummary.totalRealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {portfolioSummary.totalRealizedPnL >= 0 ? '+' : ''}$
                {portfolioSummary.totalRealizedPnL.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Positions</span>
                <span className="text-zinc-200 font-semibold">
                  {portfolioSummary.positionCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Markets Snapshot */}
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Markets Snapshot</h2>
        <div className="mt-3">
          <MarketsSnapshot />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow xl:col-span-1 md:col-span-2">
        <h2 className="mb-4 text-sm font-semibold text-zinc-200">Recent Activity</h2>
        {ordersLoading ? (
          <div className="text-center text-zinc-400 py-4">Loading...</div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-zinc-800/50 rounded">
                <div className="text-lg font-semibold text-zinc-200">{orderStats.total}</div>
                <div className="text-zinc-400">Total Orders</div>
              </div>
              <div className="text-center p-2 bg-yellow-900/20 rounded">
                <div className="text-lg font-semibold text-yellow-400">{orderStats.pending}</div>
                <div className="text-zinc-400">Pending</div>
              </div>
              <div className="text-center p-2 bg-green-900/20 rounded">
                <div className="text-lg font-semibold text-green-400">{orderStats.confirmed}</div>
                <div className="text-zinc-400">Confirmed</div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Recent Orders</h3>
              <div className="space-y-2">
                {orderStats.recentActivity.slice(0, 3).map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-xs p-2 bg-zinc-800/30 rounded"
                  >
                    <div>
                      <div className="text-zinc-300 capitalize">{order.type.replace('_', ' ')}</div>
                      <div className="text-zinc-500">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        order.status === 'confirmed'
                          ? 'text-green-400'
                          : order.status === 'pending'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                ))}
                {orderStats.recentActivity.length === 0 && (
                  <div className="text-center text-zinc-500 py-4">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
