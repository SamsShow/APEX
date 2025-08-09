'use client';

import React from 'react';
import { motion } from 'framer-motion';

const logos = ['VISA', 'Mastercard', 'PayPal', 'Stripe', 'Wise', 'Plaid'];

export function LogosMarquee() {
  return (
    <section aria-label="Trusted by" className="py-10">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur">
          <motion.div
            className="flex gap-10 whitespace-nowrap text-sm text-zinc-300"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            {[...logos, ...logos].map((l, i) => (
              <div key={i} className="rounded-full border border-white/10 px-4 py-2">
                {l}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
