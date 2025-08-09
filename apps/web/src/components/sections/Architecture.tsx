'use client';

import React from 'react';
import { Heading } from '@/components/ui/heading';
import { motion } from 'framer-motion';
import { InlineSpline } from '@/components/three/SplineInline';

export function Architecture() {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-12 items-start gap-10">
        <div className="col-span-12 md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heading as="h2" className="text-2xl text-white">
              <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-300 bg-clip-text text-transparent">
                Architecture
              </span>
            </Heading>
            <p className="mt-3 max-w-2xl text-zinc-300/90 leading-relaxed">
              Apex separates matching, risk checks, and settlement into isolated modules running in
              parallel. Batches commit atomically to Aptos for deterministic settlement and
              sub-second finality.
            </p>
            <ul className="mt-5 space-y-3 text-zinc-300/95">
              {[
                'Sharded orderbooks per instrument for horizontal scale',
                'Deterministic batcher ensures cross-leg atomicity',
                'On-chain risk engine for margin and collateralization',
                'Auditable logs and analytics for market operations',
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-green-400/90" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        <div className="col-span-12 md:col-span-5 md:justify-self-end w-full max-w-[640px] self-start">
          <InlineSpline
            scene="https://prod.spline.design/SoZMOoW2liGgP9KV/scene.splinecode"
            className="ml-auto h-[320px] w-full border-0 bg-transparent shadow-none md:h-[420px] lg:h-[520px]"
            showOverlay={false}
          />
        </div>
      </div>
    </section>
  );
}
