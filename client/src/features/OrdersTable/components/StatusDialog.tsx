import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderCreate, OrderWithDetails } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type StatusDialogProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  mutationFn: UseMutationResult<unknown, Error, OrderCreate, unknown>['mutate'];
  order: OrderWithDetails;
};

export default function StatusDialog({
  onOpenChange,
  isOpen,
  mutationFn,
  order,
}: StatusDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień status zlecenia nr {order.orderNr}</DialogTitle>
          <DialogDescription>
            Aktualny status:
            <span className='font-bold'>{order.status.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 '>
          <Button
            onClick={() => {
              mutationFn({ ...order, statusID: 3 });
            }}
          >
            Zakończone
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              mutationFn({ ...order, statusID: 1 });
            }}
          >
            W trakcie
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              mutationFn({ ...order, statusID: 2 });
            }}
          >
            Anulowane
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
