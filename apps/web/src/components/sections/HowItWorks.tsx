'use client';
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: '1. Submit Multi-leg Order',
    body: 'Client sends a single transaction with multiple legs: buy/sell options or underlyings.',
  },
  {
    title: '2. Parallel Matching',
    body: 'Apex shards orderbooks by instrument and matches legs in parallel to maximize throughput.',
  },
  {
    title: '3. Atomic Execution',
    body: 'All legs are executed atomically. If any leg cannot be filled, the entire transaction reverts.',
  },
  {
    title: '4. Settlement on Aptos',
    body: 'Finality in sub-seconds. Positions, balances, and fees update in a single state transition.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="container py-16">
      <h2
        className="text-2xl font-jersey-25 font-semibold text-white"
        style={{ fontFamily: 'Jersey 25, cursive' }}
      >
        How it works
      </h2>
      <p className="mt-2 max-w-2xl text-zinc-300">
        Apex leverages parallel execution and atomic settlement to remove execution risk while
        delivering hyper throughput on-chain.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/5 metallic-card"
          >
            {/* Animated gradient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.12] via-purple-500/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Border gradients */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-60" />
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-blue-400/30 via-purple-400/10 to-transparent opacity-60" />
            </div>

            {/* Step number with gradient */}
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-sm font-semibold text-blue-300">
              {i + 1}
            </div>

            <div
              className="text-sm font-jersey-25 font-medium text-blue-300"
              style={{ fontFamily: 'Jersey 25, cursive' }}
            >
              {s.title}
            </div>
            <div className="mt-2 text-zinc-200">{s.body}</div>

            {/* Decorative element */}
            <div className="mt-4 h-12 rounded-lg bg-gradient-to-br from-blue-500/[0.08] to-purple-500/[0.08] opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
