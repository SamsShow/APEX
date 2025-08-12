import { BALANCES, TRANSFERS } from '@/mocks/wallet';

export default function WalletPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Balances</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-300">
          {BALANCES.map((b) => (
            <div key={b.token} className="rounded-md border border-white/10 p-2">
              <div className="text-xs text-zinc-500">{b.token}</div>
              <div>{b.amount}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-white/10 bg-card/60 p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-zinc-200">Transfers</h2>
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          {TRANSFERS.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md bg-white/5 p-2">
              <span>
                {t.dir === 'in' ? '⬇️' : '⬆️'} {t.token} {t.amount}
              </span>
              <span className="text-xs text-zinc-500">{t.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
