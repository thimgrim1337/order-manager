import {
  Dialog as DialogShdcn,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';

type CreateDialogProps = {
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  children: ReactNode;
  trigger?: ReactElement | string;
  title: string;
  description: ReactElement | string;
  className?: string;
};

export default function Dialog({
  children,
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  className,
}: CreateDialogProps) {
  const isString = typeof trigger !== 'string' ? true : false;

  return (
    <DialogShdcn onOpenChange={onOpenChange} open={isOpen}>
      {trigger && (
        <DialogTrigger className='text-primary-foreground' asChild={isString}>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogShdcn>
  );
}
