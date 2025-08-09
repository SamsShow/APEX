'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Use ecosystem-oriented labels instead of web2 payments brands
const ecosystem = [
  'Aptos',
  'Pontem',
  'Thala',
  'Econia',
  'Hippo',
  'Pyth',
  'Wormhole',
  'LayerZero',
  'Tortuga',
  'OKX Web3',
];

export function LogosMarquee() {
  return (
    <section aria-label="Aptos ecosystem" className="py-10">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur">
          <motion.div
            className="flex w-max gap-6 whitespace-nowrap px-4 py-3 text-sm text-zinc-200"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
          >
            {[...ecosystem, ...ecosystem].map((label, i) => (
              <div
                key={i}
                className="rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-sm shadow-sm"
              >
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
