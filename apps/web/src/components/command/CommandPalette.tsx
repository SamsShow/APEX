'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const COMMANDS = [
  { label: 'Go to Overview', path: '/app' },
  { label: 'Go to Trade', path: '/app/trade' },
  { label: 'Go to Positions', path: '/app/positions' },
  { label: 'Go to Portfolio', path: '/app/portfolio' },
  { label: 'Go to Orders', path: '/app/orders' },
  { label: 'Go to Wallet', path: '/app/wallet' },
  { label: 'Go to Docs', path: '/app/docs' },
  { label: 'Go to Settings', path: '/app/settings' },
];

export function CommandPalette() {
  // Initialize as closed, only keyboard shortcut will open it
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>
            Search and navigate to different sections of the application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-primary/30"
          />
          <div className="max-h-64 overflow-auto">
            {results.map((c) => (
              <button
                key={c.path}
                onClick={() => {
                  router.push(c.path);
                  setOpen(false);
                }}
                className="mb-1 w-full rounded-md bg-white/5 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
