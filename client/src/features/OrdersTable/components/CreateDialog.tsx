import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Dispatch, ReactNode, SetStateAction } from 'react';

type CreateDialogProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  children: ReactNode;
};

export default function CreateDialog({
  children,
  isOpen,
  onOpenChange,
}: CreateDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogTrigger className='text-primary-foreground'>
        Dodaj zlecenie
      </DialogTrigger>
      <DialogContent className='max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>Dodaj nowe zlecenie</DialogTitle>
          <DialogDescription>
            Wypełnij wszystkie pola aby dodać nowe zlecenie.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
