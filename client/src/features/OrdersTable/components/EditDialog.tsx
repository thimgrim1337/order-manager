import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order } from '@/types/types';

import { Dispatch, ReactNode, SetStateAction } from 'react';

type EditDialogProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  children: ReactNode;
  order: Order;
};

export default function EditDialog({
  children,
  isOpen,
  onOpenChange,
  order,
}: EditDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className='max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle> Edytuj zlecenie nr {order.orderNr}</DialogTitle>
          <DialogDescription>
            W tym oknie możesz edytować swoje zlecenie.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
