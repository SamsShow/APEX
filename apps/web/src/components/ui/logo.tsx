import React from 'react';
import Image from 'next/image';

export function Logo({ className = 'h-6 w-auto' }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/apexaptoswhite.svg"
        alt="Apex"
        width={128}
        height={32}
        className="h-full w-auto"
      />
    </div>
  );
}
