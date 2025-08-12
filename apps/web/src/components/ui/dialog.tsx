'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative z-[91] w-full max-w-lg rounded-xl border border-white/10 bg-black/80 p-5 shadow-glow',
          className,
        )}
      >
        {title && <div className="mb-2 text-base font-semibold text-zinc-100">{title}</div>}
        {children}
      </div>
    </div>
  );
}
