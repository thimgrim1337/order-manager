import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/primitives/dialog';
import { Button } from '@/components/ui/primitives/button';
import { Order, OrderWithDetails } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const statusOptions = [
  { label: 'Zakończone', id: 3 },
  { label: 'W trakcie', id: 1 },
  { label: 'Anulowane', id: 2 },
];

type StatusDialogProps = {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  mutation: UseMutationResult<unknown, Error, Order, unknown>['mutate'];
  order: OrderWithDetails;
};

export default function StatusDialog({
  onOpenChange,
  isOpen,
  mutation,
  order,
}: StatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Zmień status zlecenia nr ${order.orderNr}</DialogTitle>
          <DialogDescription className='text-primary '>
            Aktualny status:
            <span className='font-semibold'> {order.status}</span>
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 '>
          <span className='text-sm text-gray-500'>Wybierz nowy status:</span>
          {statusOptions.map((status) => (
            <Button
              key={status.id}
              variant={status.id === 3 ? 'default' : 'secondary'}
              onClick={() =>
                mutation(
                  { ...order, statusID: status.id },
                  { onSettled: () => onOpenChange(false) }
                )
              }
            >
              {status.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
