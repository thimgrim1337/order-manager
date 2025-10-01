import { Plus } from 'lucide-react';
import { Button, ButtonProps } from '../primitives/button';
import { cn } from '@/lib/utils';

export default function PlusButton({
  onClick,
  className,
  variant,
}: {
  onClick?: () => void;
  className?: string;
  variant?: ButtonProps['variant'];
}) {
  return (
    <Button
      className={cn('group', className)}
      type='button'
      onClick={onClick}
      variant={variant}
    >
      <Plus className='transition-transform group-hover:rotate-45 group-hover:scale-125' />
    </Button>
  );
}
