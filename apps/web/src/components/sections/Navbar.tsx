'use client';

import React from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/40"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-7" />
          <span className="text-sm font-medium text-zinc-200/90">Apex</span>
        </div>
        <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
          <a className="hover:text-white" href="#features">
            Features
          </a>
          <a className="hover:text-white" href="#solutions">
            Solutions
          </a>
          <a className="hover:text-white" href="#resources">
            Resources
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:inline-flex">
            Docs
          </Button>
          <ConnectWalletButton />
        </div>
      </div>
    </motion.header>
  );
}
