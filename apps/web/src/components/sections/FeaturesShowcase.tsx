'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Code, Users, Brain, TrendingUp } from 'lucide-react';

export function FeaturesShowcase() {
  const features = [
    {
      icon: <Zap className="h-7 w-7 text-zinc-300" />,
      title: 'Lightning Fast',
      description: 'Sub-second finality with parallel processing across multiple shards',
      stat: '0.3s',
      statLabel: 'Avg Settlement',
      gradient: 'from-zinc-700/30 to-zinc-800/30',
    },
    {
      icon: <Shield className="h-7 w-7 text-zinc-400" />,
      title: 'Risk Free',
      description: 'Atomic multi-leg execution ensures all-or-nothing settlement',
      stat: '100%',
      statLabel: 'Success Rate',
      gradient: 'from-zinc-600/30 to-zinc-700/30',
    },
    {
      icon: <Clock className="h-7 w-7 text-zinc-300" />,
      title: 'Always Available',
      description: '99.9% uptime with automatic failover and recovery systems',
      stat: '99.9%',
      statLabel: 'Uptime',
      gradient: 'from-zinc-700/30 to-zinc-600/30',
    },
    {
      icon: <Brain className="h-7 w-7 text-zinc-400" />,
      title: 'AI-Powered Analytics',
      description:
        'Intelligent market analysis with sentiment tracking, risk assessment, and anomaly detection',
      stat: 'AI',
      statLabel: 'Enhanced',
      gradient: 'from-zinc-600/30 to-zinc-700/30',
    },
    {
      icon: <Code className="h-7 w-7 text-zinc-300" />,
      title: 'Developer First',
      description: 'Comprehensive SDKs and APIs for seamless integration',
      stat: '12',
      statLabel: 'Languages',
      gradient: 'from-zinc-700/30 to-zinc-800/30',
    },
    {
      icon: <Users className="h-7 w-7 text-zinc-400" />,
      title: 'Enterprise Ready',
      description: 'Built for institutions with enterprise-grade security and compliance',
      stat: '500+',
      statLabel: 'Institutions',
      gradient: 'from-zinc-600/30 to-zinc-700/30',
    },
    {
      icon: <TrendingUp className="h-7 w-7 text-zinc-300" />,
      title: 'Smart Trading',
      description:
        'AI-driven strategy recommendations and automated risk management for optimal returns',
      stat: '95%',
      statLabel: 'Accuracy',
      gradient: 'from-zinc-700/30 to-zinc-600/30',
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
          <h2 className="text-4xl md:text-5xl font-jersey font-bold text-white mb-6">
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
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br ${feature.gradient} p-6 backdrop-blur-sm hover:border-zinc-700 transition-all duration-300 metallic-card`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 inline-flex p-2 rounded-xl bg-zinc-800/80 backdrop-blur-sm"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-jersey font-semibold text-white mb-2 group-hover:text-zinc-200 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 mb-4 leading-relaxed text-sm">{feature.description}</p>

                {/* Stat */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{feature.stat}</span>
                  <span className="text-xs text-zinc-400">{feature.statLabel}</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-gradient-to-br from-zinc-600/10 to-transparent rounded-full blur-xl opacity-30" />
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-zinc-500/50 rounded-full animate-pulse" />
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
