import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  mutationFn: UseMutationResult<unknown, Error, OrderWithId, unknown>['mutate'];
  order: OrderWithId;
};

export default function EditDialog({
  isOpen,
  onOpenChange,
  order,
  mutationFn,
  isPending,
}: EditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj zlecenie nr ${order.orderNr}</DialogTitle>
          <DialogDescription>
            W tym oknie możesz edytować swoje zlecenie.
          </DialogDescription>
        </DialogHeader>
        <OrderForm
          values={order}
          mutationFn={mutationFn}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
