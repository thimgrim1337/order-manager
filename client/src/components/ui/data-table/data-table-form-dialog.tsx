import { ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '../dialog';

type FormDialogProps = {
  dialogTriggerText: string;
  dialogTitle: string;
  dialogDescription?: string;
  children?: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FormDialog({
  dialogTriggerText,
  dialogTitle,
  dialogDescription,
  children,
  isOpen,
  onOpenChange,
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className='text-primary-foreground'>
        {dialogTriggerText}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
