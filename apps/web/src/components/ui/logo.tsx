import React from 'react';

export function Logo({ className = 'h-6 w-auto' }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 32 32" className="h-full w-full">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#g)" />
        <path d="M12 16h8M16 12v8" stroke="#0b0b0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
