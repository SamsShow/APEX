'use client';

import React from 'react';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Command } from 'lucide-react';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { NotificationBell } from '@/components/ui/notification-bell';

export function Topbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/50 bg-zinc-900/80 px-4 backdrop-blur-lg supports-[backdrop-filter]:bg-zinc-900/60">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/50"
          >
            Menu
          </Button>
          <MobileSidebar open={open} onClose={() => setOpen(false)} />
        </div>
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm">Live</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex items-center gap-2 border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-700/50 text-zinc-300"
        >
          <Command className="h-4 w-4" />
          <kbd className="text-[10px] font-medium bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
            ⌘K
          </kbd>
        </Button>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
