import React from 'react';
import { Balancer } from 'react-wrap-balancer';
import { cn } from '@/lib/utils';

type HeadingProps = {
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
};

export function Heading({ className, children, as: Tag = 'h1', style }: HeadingProps) {
  return (
    <Tag className={cn('font-semibold tracking-tight', className)} style={style}>
      <Balancer>{children}</Balancer>
    </Tag>
  );
}
