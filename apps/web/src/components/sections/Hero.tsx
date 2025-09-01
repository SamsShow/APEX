'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { SplineCanvas } from '@/components/three/SplineCanvas';
import { InlineSpline } from '@/components/three/SplineInline';
import { CheckCircle2, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full py-24">
      {/* background spline for small screens only to keep performance */}
      <div className="pointer-events-none absolute inset-0 -z-10 md:hidden">
        <SplineCanvas />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="container grid max-w-screen-xl grid-cols-12 items-center gap-8">
        <div className="col-span-12 md:col-span-7 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl shadow-xl"
          >
            🚀 Revolutionizing DeFi with AI &
            <span className="font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              atomic execution
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Heading className="text-balance text-5xl font-jersey font-semibold leading-tight sm:text-6xl md:text-7xl">
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
            Atomic trades with sub-second finality on Aptos. Powered by AI for intelligent trading,
            risk management, and market analysis. Lower fees, zero execution risk, built for scale.
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
              'AI-powered risk management',
              'Smart strategy recommendations',
            ].map((item, index) => (
              <motion.li
                key={item}
                className="flex items-center gap-3 text-sm group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.3 }}>
                  <CheckCircle2 className="h-4 w-4 text-green-400 group-hover:text-green-300" />
                </motion.div>
                <span className="group-hover:text-white transition-colors duration-200">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/app">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 shadow-lg shadow-blue-500/25">
                  Get Started
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="border-2 border-green-400/50 hover:border-green-400 hover:bg-green-400/10 backdrop-blur-sm px-8 py-3 text-green-400 hover:text-green-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test the Demo
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm px-8 py-3"
              >
                Book a Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        {/* Right visual: inline spline on md+ screens */}
        <div className="col-span-12 md:col-span-5 lg:col-span-5 hidden md:block">
          <InlineSpline
            scene="https://prod.spline.design/4nta309VBD1dc1OZ/scene.splinecode"
            className="ml-auto"
          />
        </div>
      </div>
    </section>
  );
}
