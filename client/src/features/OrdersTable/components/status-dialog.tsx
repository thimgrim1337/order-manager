import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/primitives/dialog';
import { Button } from '@/components/ui/primitives/button';
import { OrderWithDetails, OrderWithId } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type StatusDialogProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  mutationFn: UseMutationResult<unknown, Error, OrderWithId, unknown>['mutate'];
  order: OrderWithDetails;
};

export default function StatusDialog({
  onOpenChange,
  isOpen,
  mutationFn,
  order,
}: StatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Zmień status zlecenia nr ${order.orderNr}</DialogTitle>
          <DialogDescription className='text-primary '>
            Aktualny status:
            <span className='font-semibold'> {order.status.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 '>
          <span className='text-sm text-gray-500'>Wybierz nowy status:</span>
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
