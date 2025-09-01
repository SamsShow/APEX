'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Activity, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AIFeatures() {
  const aiFeatures = [
    {
      icon: <Brain className="h-12 w-12 text-blue-300" />,
      title: 'AI Strategy Advisor',
      description:
        'Get personalized trading strategies based on your risk profile and market conditions. Our AI analyzes thousands of data points to recommend optimal entry/exit points.',
      features: ['Risk-adjusted recommendations', 'Market regime analysis', 'Strategy backtesting'],
      gradient: 'from-blue-500/5 to-blue-400/5',
      color: 'text-blue-300',
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-zinc-300" />,
      title: 'Sentiment Analysis',
      description:
        'Real-time sentiment tracking from social media, news, and on-chain data. Understand market psychology and predict price movements.',
      features: [
        'Social media monitoring',
        'News sentiment analysis',
        'On-chain sentiment tracking',
      ],
      gradient: 'from-zinc-500/5 to-zinc-400/5',
      color: 'text-zinc-300',
    },
    {
      icon: <Shield className="h-12 w-12 text-zinc-400" />,
      title: 'Risk Assessment',
      description:
        'Comprehensive portfolio risk analysis with stress testing and optimization recommendations. Identify hidden risks before they impact your returns.',
      features: ['Portfolio stress testing', 'VaR calculations', 'Risk optimization'],
      gradient: 'from-zinc-600/5 to-zinc-500/5',
      color: 'text-zinc-400',
    },
    {
      icon: <AlertTriangle className="h-12 w-12 text-zinc-200" />,
      title: 'Anomaly Detection',
      description:
        'Detect unusual market movements, arbitrage opportunities, and regime changes in real-time. Never miss critical market events.',
      features: ['Price spike detection', 'Arbitrage opportunities', 'Market regime shifts'],
      gradient: 'from-zinc-400/5 to-zinc-300/5',
      color: 'text-zinc-200',
    },
  ];

  const aiStats = [
    { label: 'Prediction Accuracy', value: '94%', description: 'Historical backtest performance' },
    { label: 'Risk Reduction', value: '35%', description: 'Average portfolio risk reduction' },
    { label: 'Trading Signals', value: '500+', description: 'Signals generated daily' },
    { label: 'Market Coverage', value: '100%', description: 'Markets monitored globally' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/5 via-transparent to-zinc-700/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-700/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/5 rounded-full blur-3xl opacity-20" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            <span>AI-Powered Trading</span>
          </div>

          <h2
            className="text-4xl md:text-6xl font-jersey-25 font-bold text-white mb-6"
            style={{ fontFamily: 'Jersey 25, cursive' }}
          >
            Intelligence That{' '}
            <span className="bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 bg-clip-text text-transparent">
              Trades Smarter
            </span>
          </h2>

          <p className="text-xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
            Harness the power of advanced AI algorithms to analyze markets, predict trends, and
            optimize your trading strategies. Experience institutional-grade analytics accessible to
            everyone.
          </p>
        </motion.div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br ${feature.gradient} p-6 backdrop-blur-sm hover:border-zinc-700 transition-all duration-500 metallic-card`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 inline-flex p-3 rounded-xl bg-zinc-800/80 backdrop-blur-sm group-hover:bg-zinc-800 transition-colors duration-300"
                >
                  {feature.icon}
                </motion.div>

                <h3
                  className="text-xl font-jersey-25 font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300"
                  style={{ fontFamily: 'Jersey 25, cursive' }}
                >
                  {feature.title}
                </h3>

                <p className="text-zinc-400 mb-4 leading-relaxed text-sm">{feature.description}</p>

                {/* Feature bullets */}
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-1 h-1 rounded-full ${feature.color.replace('text-', 'bg-')}`}
                      />
                      <span className="text-xs text-zinc-500">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-zinc-600/10 to-transparent rounded-full blur-xl opacity-30" />
            </motion.div>
          ))}
        </div>

        {/* AI Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {aiStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="text-center p-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-300 metallic-card"
            >
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-zinc-300 mb-1">{stat.label}</div>
              <div className="text-xs text-zinc-500">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Trade with AI?</h3>
            <p className="text-zinc-300 mb-8 leading-relaxed">
              Join thousands of traders who are already using our AI-powered platform to maximize
              their returns and minimize their risks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 border border-zinc-700"
              >
                Start Trading with AI
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                <Activity className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
