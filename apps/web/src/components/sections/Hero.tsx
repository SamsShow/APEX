'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
      </div>
      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-300 backdrop-blur"
        >
          Empower your finances with
          <span className="font-semibold text-white">seamless payments</span>
        </motion.p>
        <Heading className="text-balance text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
          <span className="text-white/90">A hyper-fast on-chain</span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            matching engine for options
          </span>
        </Heading>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-6 max-w-2xl text-lg text-zinc-300"
        >
          Atomic trades with sub-second finality on Aptos. Lower fees, zero execution risk, built
          for scale.
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button className="">Get Started</Button>
          <Button variant="outline">Book a demo</Button>
        </div>
      </div>
    </section>
  );
}
