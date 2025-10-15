import { ReactNode } from 'react';
import { Badge } from './ui/primitives/badge';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  statusID: number;
  children: ReactNode;
  className?: string;
};

const colors = ['bg-yellow-600', 'bg-red-600', 'bg-green-600'];

export default function StatusBadge({
  statusID,
  children,
  className,
}: StatusBadgeProps) {
  const color = colors[statusID - 1];
  return (
    <Badge
      className={cn(`${color} hover:${color} whitespace-nowrap`, className)}
    >
      {children}
    </Badge>
  );
}
