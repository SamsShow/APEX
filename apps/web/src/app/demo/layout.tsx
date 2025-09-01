'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Play,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Target,
  Zap,
} from 'lucide-react';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white">
      {/* Demo Header */}
      <header className="sticky top-0 z-50 border-b border-green-400/20 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">APEX Demo</h1>
                  <p className="text-xs text-green-400">Interactive Demo Environment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-400">Demo Mode - No Real Transactions</div>
              <Link href="/app">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Launch Real App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Navigation */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            {[
              { href: '/demo', label: 'Overview', icon: TrendingUp },
              { href: '/demo/trade', label: 'Trade', icon: Zap },
              { href: '/demo/markets', label: 'Markets', icon: BarChart3 },
              { href: '/demo/portfolio', label: 'Portfolio', icon: PieChart },
              { href: '/demo/analytics', label: 'Analytics', icon: Activity },
              { href: '/demo/orders', label: 'Orders', icon: Target },
              { href: '/demo/risk', label: 'Risk', icon: Settings },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Demo Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Demo Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              This is a demo environment showcasing APEX platform features
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Demo Active
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
