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
      <h2 className="text-2xl font-semibold text-white">How it works</h2>
      <p className="mt-2 max-w-2xl text-zinc-300">
        Apex leverages parallel execution and atomic settlement to remove execution risk while
        delivering hyper throughput on-chain.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-black/40 p-6"
          >
            <div className="text-sm text-zinc-400">{s.title}</div>
            <div className="mt-1 text-zinc-200">{s.body}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
