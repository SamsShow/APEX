'use client';

import React from 'react';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Command } from 'lucide-react';
import { MobileSidebar } from '@/components/layout/Sidebar';

export function Topbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/50 bg-slate-900/80 px-4 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-900/60">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
          >
            Menu
          </Button>
          <MobileSidebar open={open} onClose={() => setOpen(false)} />
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm">Live</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-2 border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300"
        >
          <Command className="h-4 w-4" />
          <kbd className="text-[10px] font-medium bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </kbd>
        </Button>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
