import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '../dialog';

type FormDialogProps = {
  triggerText?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  isOpen?: boolean;
  asChild?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
};

export default function FormDialog({
  triggerText,
  title,
  description,
  children,
  isOpen,
  onOpenChange,
  asChild,
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerText && (
        <DialogTrigger className='text-primary-foreground' asChild={asChild}>
          {triggerText}
        </DialogTrigger>
      )}
      <DialogContent className='max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
