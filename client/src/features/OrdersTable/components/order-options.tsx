import { Button } from '@/components/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/primitives/dropdown-menu';
import {
  removeOrder,
  updateOrder,
} from '@/features/OrderForm/mutations/orderMutation';
import { OrderWithDetails, Order } from '@/types/types';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import StatusDialog from './status-dialog';
import EditDialog from './edit-dialog';
import RemoveDialog from './remove-dialog';
import { useOptimisticMutation } from '@/features/OrderForm/hooks/useOptimisticMutation';

type TableRowDropdownProps = {
  order: OrderWithDetails;
};

export default function OrderOptions({ order }: TableRowDropdownProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState<boolean>(false);

  const { mutate: editMutation, isPending } = useOptimisticMutation<Order>({
    mutationFn: updateOrder,
    queryKey: ['orders'],
    successMessage: `Edytowanie zlecenia nr ${order.orderNr}.`,
    errorMessage: 'Nie udało się edytować zlecenia. Spróbuj ponownie.',
  });

  const { mutate: statusMutation } = useOptimisticMutation<Order>({
    mutationFn: updateOrder,
    queryKey: ['orders'],
    successMessage: `Zmiana statusu zlecenia nr ${order.orderNr}.`,
    errorMessage: 'Nie udało się zmienić statusu zlecenia. Spróbuj ponownie.',
  });

  const { mutate: removeMutation } = useOptimisticMutation<Order>({
    mutationFn: removeOrder,
    queryKey: ['orders'],
    successMessage: `Pomyślnie usuniętlo zlecenie nr ${order.orderNr}.`,
    errorMessage: 'Nie udało się usunąć zlecenia. Spróbuj ponownie.',
  });

  return (
    <>
      {isStatusOpen && (
        <StatusDialog
          isOpen={isStatusOpen}
          onOpenChange={setIsStatusOpen}
          order={order}
          mutation={statusMutation}
        />
      )}

      {isEditOpen && (
        <EditDialog
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          order={order}
          isPending={isPending}
          mutation={editMutation}
        />
      )}

      {isRemoveOpen && (
        <RemoveDialog
          onOpenChange={setIsRemoveOpen}
          isOpen={isRemoveOpen}
          mutation={removeMutation}
          order={order}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className='h-8 w-8 p-0 bg-transparent'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
          <DropdownMenuItem id='status' onClick={() => setIsStatusOpen(true)}>
            Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem id='edit' onClick={() => setIsEditOpen(true)}>
            Edytuj
          </DropdownMenuItem>
          <DropdownMenuItem id='remove' onClick={() => setIsRemoveOpen(true)}>
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
