import { FormLabel as Label } from '@/components/ui/primitives/form';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import { ComponentType, ReactNode } from 'react';

export default function FormLabel({
  children,
  className,
  Icon,
}: {
  children: ReactNode;
  className?: string;
  Icon?: ComponentType<LucideProps>;
}) {
  return (
    <Label className={cn('flex items-center gap-2', className)}>
      {Icon && <Icon size={'1.3rem'} />}
      {children}
    </Label>
  );
}
