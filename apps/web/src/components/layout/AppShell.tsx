'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ToastProvider } from '@/components/ui/toast';
import { CommandPalette } from '@/components/command/CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full bg-black text-zinc-100">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="container mx-auto w-full max-w-[1400px] flex-1 px-6 pb-12 pt-6">
            {children}
          </main>
        </div>
      </div>
      <CommandPalette />
    </ToastProvider>
  );
}
