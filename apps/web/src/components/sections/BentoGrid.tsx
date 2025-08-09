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
};

export function BentoGrid() {
  const items: Item[] = [
    {
      title: 'Sub-second Finality',
      description: 'Parallel execution for atomic multi-leg trades.',
      className: 'md:col-span-2',
      glow: true,
      icon: <Zap className="h-6 w-6 text-amber-400" />,
    },
    {
      title: 'Low Fees',
      description: 'Efficient, scalable settlements on Aptos.',
      icon: <Coins className="h-6 w-6 text-green-400" />,
    },
    {
      title: 'Zero Execution Risk',
      description: 'All or nothing fills with deterministic outcomes.',
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
    },
    {
      title: 'Programmable Liquidity',
      description: 'Composable venues and strategies for options.',
      className: 'md:col-span-2',
      icon: <Code className="h-6 w-6 text-purple-400" />,
    },
  ];

  return (
    <section id="features" className="container pb-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/5',
              item.className,
            )}
          >
            {/* Animated gradient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Border gradients */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-60" />
            </div>

            {/* Glow effect for featured cards */}
            {item.glow && (
              <div className="pointer-events-none absolute inset-0 -z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-50 blur-xl" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-60" />
              </div>
            )}

            {/* Content */}
            <motion.div
              className="mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
            >
              {item.icon}
            </motion.div>

            <motion.div
              className="text-sm text-zinc-400 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
            >
              {item.description}
            </motion.div>

            <motion.div
              className="text-xl font-semibold text-white"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.4, duration: 0.5 }}
            >
              {item.title}
            </motion.div>

            {/* Decorative element */}
            <div className="mt-6 h-16 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
