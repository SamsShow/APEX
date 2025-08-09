import React from 'react';

const stats = [
  { label: 'Fills per second', value: '12,500+' },
  { label: 'Avg. settlement', value: '< 1s' },
  { label: 'Gas savings', value: '38%' },
  { label: 'Venues supported', value: '8+' },
];

export function Stats() {
  return (
    <section className="py-12">
      <div className="container grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-black/40 p-8 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="">
            <div className="text-3xl font-semibold text-white">{s.value}</div>
            <div className="mt-1 text-xs text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
