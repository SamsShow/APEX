'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, BarChart3, Code, Users } from 'lucide-react';

export function FeaturesShowcase() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'Lightning Fast',
      description: 'Sub-second finality with parallel processing across multiple shards',
      stat: '0.3s',
      statLabel: 'Avg Settlement',
      gradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: 'Risk Free',
      description: 'Atomic multi-leg execution ensures all-or-nothing settlement',
      stat: '100%',
      statLabel: 'Success Rate',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: 'Always Available',
      description: '99.9% uptime with automatic failover and recovery systems',
      stat: '99.9%',
      statLabel: 'Uptime',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
      title: 'Deep Analytics',
      description: 'Real-time market data with advanced charting and analysis tools',
      stat: '50+',
      statLabel: 'Metrics',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <Code className="h-8 w-8 text-red-400" />,
      title: 'Developer First',
      description: 'Comprehensive SDKs and APIs for seamless integration',
      stat: '12',
      statLabel: 'Languages',
      gradient: 'from-red-500/20 to-rose-500/20',
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-400" />,
      title: 'Enterprise Ready',
      description: 'Built for institutions with enterprise-grade security and compliance',
      stat: '500+',
      statLabel: 'Institutions',
      gradient: 'from-indigo-500/20 to-blue-500/20',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-black/20 to-transparent">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Apex
            </span>
            ?
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Experience the next generation of DeFi infrastructure designed for performance,
            security, and scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${feature.gradient} p-8 backdrop-blur-sm hover:border-white/20 transition-all duration-300`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 inline-flex p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-zinc-300 mb-6 leading-relaxed">{feature.description}</p>

                {/* Stat */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{feature.stat}</span>
                  <span className="text-sm text-zinc-400">{feature.statLabel}</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-50" />
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-6">Ready to experience the future of DeFi?</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-zinc-300 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 cursor-pointer">
            <span>Learn more about our technology</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              →
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
