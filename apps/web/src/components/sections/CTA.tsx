'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-orange-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent p-12 text-center backdrop-blur-xl shadow-2xl"
        >
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-8 right-12 w-2 h-2 bg-blue-400 rounded-full opacity-60"
            />
            <motion.div
              animate={{
                x: [0, -25, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50"
            />
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
              className="absolute top-16 left-8 w-1 h-1 bg-orange-400 rounded-full opacity-40"
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Ready to revolutionize your trading?</span>
            </div>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Join the Apex Revolution
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto"
          >
            Experience sub-second finality, zero execution risk, and unparalleled performance. Start
            building the future of DeFi today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-xl shadow-blue-500/25 group">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
