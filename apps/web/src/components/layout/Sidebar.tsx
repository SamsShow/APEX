'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import {
  LayoutGrid,
  CandlestickChart,
  Activity,
  LineChart,
  Wallet,
  BookOpenCheck,
  Settings,
  BarChart3,
  ListChecks,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/app', label: 'overview', icon: <LayoutGrid className="h-4 w-4" /> },
  { href: '/app/markets', label: 'markets', icon: <LineChart className="h-4 w-4" /> },
  { href: '/app/trade', label: 'trade', icon: <CandlestickChart className="h-4 w-4" /> },
  { href: '/app/positions', label: 'positions', icon: <Activity className="h-4 w-4" /> },
  { href: '/app/portfolio', label: 'portfolio', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/app/orders', label: 'orders', icon: <ListChecks className="h-4 w-4" /> },
  { href: '/app/wallet', label: 'wallet', icon: <Wallet className="h-4 w-4" /> },
  { href: '/app/docs', label: 'docs', icon: <BookOpenCheck className="h-4 w-4" /> },
  { href: '/app/settings', label: 'settings', icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky left-0 top-0 z-40 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur md:block">
      <div className="flex h-16 items-center gap-3 px-5">
        <Logo className="h-7" />
        <span className="text-sm font-medium text-zinc-200/90">Apex</span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
                active && 'bg-white/10 text-zinc-100 shadow-glow',
              )}
            >
              <span className="text-zinc-300 group-hover:text-white">{item.icon}</span>
              <span className="capitalize">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3 text-xs text-zinc-500">
        <p>testnet</p>
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <div
      className={cn('fixed inset-0 z-50 md:hidden', open ? '' : 'pointer-events-none')}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-black/80 backdrop-blur transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <Logo className="h-7" />
          <span className="text-sm font-medium text-zinc-200/90">Apex</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
                  active && 'bg-white/10 text-zinc-100 shadow-glow',
                )}
              >
                <span className="text-zinc-300 group-hover:text-white">{item.icon}</span>
                <span className="capitalize">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 text-xs text-zinc-500">
          <p>testnet</p>
        </div>
      </div>
    </div>
  );
}
