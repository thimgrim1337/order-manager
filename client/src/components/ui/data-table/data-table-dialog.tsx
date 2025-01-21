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
  btnText: string;
  dialogTitle: string;
  dialogDescription?: string;
  children?: ReactNode;
};

export default function FormDialog({
  btnText,
  dialogTitle,
  dialogDescription,
  children,
}: FormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className='text-primary-foreground'>
        {btnText}
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
