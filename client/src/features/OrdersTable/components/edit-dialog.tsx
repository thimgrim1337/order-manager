import Dialog from '@/components/ui/form/dialog';
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
    <Dialog
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      title={`Edytuj zlecenie nr ${order.orderNr}`}
      description={'W tym oknie możesz edytować swoje zlecenie.'}
      className='max-w-screen-lg'
    >
      <OrderForm values={order} mutationFn={mutationFn} isPending={isPending} />
    </Dialog>
  );
}
