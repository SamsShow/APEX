'use client';

import React from 'react';
import { motion } from 'framer-motion';

const quotes = [
  {
    name: 'Lena — Head of Trading, Vertex Capital',
    quote:
      'Apex eliminated our execution risk and cut our fees by 32%. Multi-leg fills are truly atomic and blazing fast.',
  },
  {
    name: 'Noah — CTO, Delta Strategies',
    quote:
      'The matching throughput is insane. We migrated our RFQ desk to Apex in a week thanks to the clean SDK.',
  },
  {
    name: 'Sofia — Founder, Gamma Options',
    quote: 'Best on-chain options infra we have used. Transparent, auditable and performant.',
  },
];

export function Testimonials() {
  return (
    <section className="container py-16">
      <h2 className="text-2xl font-semibold text-white">What users say</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {quotes.map((q, i) => (
          <motion.div
            key={q.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-white/5"
          >
            {/* Animated gradient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.12] via-teal-500/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Border gradients */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-60" />
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-emerald-400/30 via-teal-400/10 to-transparent opacity-60" />
            </div>

            {/* Quote icon */}
            <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
              <svg className="h-4 w-4 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <blockquote className="leading-relaxed text-zinc-200">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-emerald-300 font-medium">{q.name}</figcaption>

            {/* Decorative element */}
            <div className="mt-4 h-8 rounded-lg bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.08] opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
