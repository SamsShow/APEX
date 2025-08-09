'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Item = {
  title: string;
  description: string;
  className?: string;
  glow?: boolean;
  icon?: React.ReactNode;
};

export function BentoGrid() {
  const items: Item[] = [
    {
      title: 'Sub-second Finality',
      description: 'Parallel execution for atomic multi-leg trades.',
      className: 'md:col-span-2',
      glow: true,
    },
    {
      title: 'Low Fees',
      description: 'Efficient, scalable settlements on Aptos.',
    },
    {
      title: 'Zero Execution Risk',
      description: 'All or nothing fills with deterministic outcomes.',
    },
    {
      title: 'Programmable Liquidity',
      description: 'Composable venues and strategies for options.',
      className: 'md:col-span-2',
    },
  ];

  return (
    <section id="features" className="container pb-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-black/20 transition-colors hover:bg-card/90',
              item.className,
            )}
          >
            {item.glow && (
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-orange-500/10 to-purple-500/0 opacity-70 blur-2xl" />
            )}
            <div className="text-sm text-zinc-400">{item.description}</div>
            <div className="mt-2 text-xl font-semibold text-white">{item.title}</div>
            <div className="mt-6 h-24 rounded-xl bg-gradient-to-br from-white/5 to-transparent" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
