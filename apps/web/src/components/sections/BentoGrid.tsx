'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, Coins, ShieldCheck, Code } from 'lucide-react';

type Item = {
  title: string;
  description: string;
  className?: string;
  glow?: boolean;
  icon?: React.ReactNode;
  stat?: string;
  statLabel?: string;
  detail?: string;
};

export function BentoGrid() {
  const items: Item[] = [
    {
      title: 'Sub-second Finality',
      description: 'Parallel execution for atomic multi-leg trades.',
      className: 'md:col-span-2',
      glow: true,
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      stat: '0.3s',
      statLabel: 'Average Settlement',
      detail:
        'Optimized parallel execution across multiple shards enables near-instant transaction finality.',
    },
    {
      title: 'Low Fees',
      description: 'Efficient, scalable settlements on Aptos.',
      icon: <Coins className="h-6 w-6 text-green-400" />,
      stat: '0.01%',
      statLabel: 'Transaction Fee',
      detail: 'Industry-leading low fees with volume-based discounts for active traders.',
    },
    {
      title: 'Zero Execution Risk',
      description: 'All or nothing fills with deterministic outcomes.',
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
      stat: '100%',
      statLabel: 'Success Rate',
      detail: 'Guaranteed atomic execution eliminates partial fills and slippage concerns.',
    },
    {
      title: 'Programmable Liquidity',
      description: 'Composable venues and strategies for options.',
      className: 'md:col-span-2',
      icon: <Code className="h-6 w-6 text-purple-400" />,
      stat: '15+',
      statLabel: 'Strategy Templates',
      detail: 'Create custom market making strategies with our flexible liquidity framework.',
    },
  ];

  return (
    <section id="features" className="container pb-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-900/20 cursor-pointer metallic-card',
              item.className,
            )}
          >
            {/* Animated gradient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-zinc-900/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Border gradients */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent opacity-60" />
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-zinc-700/30 via-zinc-800/10 to-transparent opacity-60" />
            </div>

            {/* Glow effect for featured cards */}
            {item.glow && (
              <div className="pointer-events-none absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/10 via-zinc-800/5 to-transparent opacity-50 blur-xl" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-zinc-600/10 to-zinc-700/10 opacity-0 blur transition-opacity duration-500 group-hover:opacity-40" />
              </div>
            )}

            {/* Content */}
            <div className="flex justify-between items-start mb-4">
              <motion.div
                className="p-2 rounded-lg bg-zinc-800/50"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
              >
                {item.icon}
              </motion.div>

              {item.stat && (
                <motion.div
                  className="flex flex-col items-end"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                >
                  <span className="text-xl font-bold text-white">{item.stat}</span>
                  <span className="text-xs text-zinc-500">{item.statLabel}</span>
                </motion.div>
              )}
            </div>

            <motion.div
              className="text-xl font-jersey font-semibold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
            >
              {item.title}
            </motion.div>

            <motion.div
              className="text-sm text-zinc-400 mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.4, duration: 0.5 }}
            >
              {item.description}
            </motion.div>

            {/* Additional detail */}
            {item.detail && (
              <motion.div
                className="text-xs text-zinc-500 border-t border-zinc-800/50 pt-3 mt-3"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.5, duration: 0.5 }}
              >
                {item.detail}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
