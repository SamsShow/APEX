'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { SplineCanvas } from '@/components/three/SplineCanvas';
import { CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full py-24">
      {/* spline backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <SplineCanvas />
        {/* subtle dark overlay to keep text readable without hiding the Spline */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="container grid max-w-screen-xl grid-cols-12 items-center gap-8">
        <div className="col-span-12 md:col-span-7 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl shadow-xl"
          >
            Empower your finances with
            <span className="font-semibold text-white">seamless payments</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Heading className="text-balance text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
              <span className="text-white/90">A hyper-fast on-chain</span>
              <br />
              <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-300 bg-clip-text text-transparent animate-shine bg-[length:200%_100%]">
                matching engine for options
              </span>
            </Heading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 max-w-2xl text-lg text-zinc-300"
          >
            Atomic trades with sub-second finality on Aptos. Lower fees, zero execution risk, built
            for scale.
          </motion.p>
          <motion.ul
            className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-zinc-300 sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              'Parallel matching across shardable books',
              'Atomic multi-leg settlement',
              'On-chain risk engine',
              'SDKs for rapid integration',
            ].map((item, index) => (
              <motion.li
                key={item}
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-400" /> {item}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <Button className="">Get Started</Button>
            <Button variant="outline">Book a demo</Button>
          </motion.div>
        </div>
        <div className="col-span-12 md:col-span-5 lg:col-span-5" />
      </div>
    </section>
  );
}
