import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/primitives/dialog';
import OrderForm from '@/features/OrderForm/components/order-form';
import { OrderWithId } from '@/types/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type EditDialogProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  isPending: UseMutationResult<
    unknown,
    Error,
    OrderWithId,
    unknown
  >['isPending'];
  mutation: UseMutationResult<unknown, Error, OrderWithId, unknown>;
  order: OrderWithId;
};

export default function EditDialog({
  isOpen,
  onOpenChange,
  order,
  mutation,
  isPending,
}: EditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-screen-lg'>
        <DialogHeader>
          <DialogTitle>Edytuj zlecenie nr {order.orderNr}</DialogTitle>
          <DialogDescription>
            W tym oknie możesz edytować swoje zlecenie.
          </DialogDescription>
        </DialogHeader>
        <OrderForm<OrderWithId>
          values={order}
          mutation={mutation}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
