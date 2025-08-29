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
  History,
  GitBranch,
  PieChart,
  Shield,
  Target,
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
  { href: '/app/advanced-orders', label: 'advanced', icon: <Target className="h-4 w-4" /> },
  { href: '/app/strategies', label: 'strategies', icon: <GitBranch className="h-4 w-4" /> },
  { href: '/app/positions', label: 'positions', icon: <Activity className="h-4 w-4" /> },
  { href: '/app/portfolio', label: 'portfolio', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/app/analytics', label: 'analytics', icon: <PieChart className="h-4 w-4" /> },
  { href: '/app/risk', label: 'risk', icon: <Shield className="h-4 w-4" /> },
  { href: '/app/orders', label: 'orders', icon: <ListChecks className="h-4 w-4" /> },
  { href: '/app/transactions', label: 'transactions', icon: <History className="h-4 w-4" /> },
  { href: '/app/wallet', label: 'wallet', icon: <Wallet className="h-4 w-4" /> },
  { href: '/app/docs', label: 'docs', icon: <BookOpenCheck className="h-4 w-4" /> },
  { href: '/app/settings', label: 'settings', icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky left-0 top-0 z-40 hidden h-screen w-64 shrink-0 border-r border-slate-800/50 bg-slate-900/80 backdrop-blur-lg md:block">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-800/30">
        <Logo className="h-7" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Apex</span>
          <span className="text-xs text-slate-400">Trading Platform</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 text-slate-400 hover:bg-slate-800/50 hover:text-white',
                active &&
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10',
              )}
            >
              <span
                className={cn(
                  'transition-colors',
                  active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                )}
              >
                {item.icon}
              </span>
              <span className="capitalize font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            <span className="text-amber-300 font-medium">Testnet</span>
          </div>
          <p className="mt-1 text-xs text-amber-400/80">Experimental features active</p>
        </div>
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
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute left-0 top-0 flex h-full w-72 flex-col border-r border-slate-800/50 bg-slate-900/95 backdrop-blur-lg transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-800/30">
          <Logo className="h-7" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Apex</span>
            <span className="text-xs text-slate-400">Trading Platform</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 text-slate-400 hover:bg-slate-800/50 hover:text-white',
                  active && 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                )}
              >
                <span
                  className={cn(
                    'transition-colors',
                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                  )}
                >
                  {item.icon}
                </span>
                <span className="capitalize font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-amber-400"></div>
              <span className="text-amber-300 font-medium">Testnet</span>
            </div>
            <p className="mt-1 text-xs text-amber-400/80">Experimental features active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
