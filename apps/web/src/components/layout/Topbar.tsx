'use client';

import React from 'react';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Command } from 'lucide-react';
import { MobileSidebar } from '@/components/layout/Sidebar';

export function Topbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/30 px-4 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="md:hidden">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Menu
        </Button>
        <MobileSidebar open={open} onClose={() => setOpen(false)} />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
          <Command className="h-4 w-4" />
          <span className="text-xs">⌘K</span>
        </Button>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
