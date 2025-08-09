import React from 'react';
import { Balancer } from 'react-wrap-balancer';
import { cn } from '@/lib/utils';

type HeadingProps = {
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
};

export function Heading({ className, children, as: Tag = 'h1' }: HeadingProps) {
  return (
    <Tag className={cn('font-semibold tracking-tight', className)}>
      <Balancer>{children}</Balancer>
    </Tag>
  );
}
