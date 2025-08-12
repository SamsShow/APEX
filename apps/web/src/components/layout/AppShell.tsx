'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ToastProvider } from '@/components/ui/toast';
import { CommandPalette } from '@/components/command/CommandPalette';
import { StatusBar } from '@/components/layout/StatusBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full bg-black text-zinc-100">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="container mx-auto w-full max-w-[1400px] flex-1 px-6 pb-12 pt-6">
            <div className="motion-reduce:transition-none motion-safe:transition-all motion-safe:duration-300 motion-safe:animate-in motion-safe:fade-in">
              {children}
            </div>
          </main>
          <StatusBar />
        </div>
      </div>
      <CommandPalette />
    </ToastProvider>
  );
}
