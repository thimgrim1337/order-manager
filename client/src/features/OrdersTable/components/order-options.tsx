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
import { OrderDetails, OrderWithId } from '@/types/types';
import { MoreHorizontal } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import StatusDialog from './status-dialog';
import EditDialog from './edit-dialog';
import RemoveDialog from './remove-dialog';
import { useUpdateMutation } from '@/features/OrderForm/hooks/useUpdateMutation';

type TableRowDropdownProps = {
  order: OrderDetails;
};

export default function OrderOptions({ order }: TableRowDropdownProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState<boolean>(false);

  const { mutation: updateMutation } = useUpdateMutation<OrderWithId>({
    mutationFn: updateOrder,
    queryKey: ['orders'],
    toastTitle: 'Edycja zlecenia',
    toastDescription: `Edytowanie zlecenia nr ${order.orderNr}.`,
    errorDescription: 'Nie udało się edytować zlecenia. Spróbuj ponownie.',
    onOpenDialogChange: setIsEditOpen,
  });

  const { mutation: removeMutation } = useUpdateMutation<OrderWithId>({
    mutationFn: removeOrder,
    queryKey: ['orders'],
    toastTitle: 'Usuwanie zlecenia',
    toastDescription: `Pomyślnie usuniętlo zlecenie nr ${order.orderNr}.`,
    errorDescription: 'Nie udało się usunąc zlecenia. Spróbuj ponownie.',
    onOpenDialogChange: setIsRemoveOpen,
  });

  function onClick(e: MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) {
      const id = e.target.id;

      if (id === 'status') setIsStatusOpen(true);
      if (id === 'edit') setIsEditOpen(true);
      if (id === 'remove') setIsRemoveOpen(true);
    }
  }

  return (
    <>
      <StatusDialog
        isOpen={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        order={order}
        mutationFn={updateMutation.mutate}
      />

      <EditDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        order={order}
        isPending={updateMutation.isPending}
        mutationFn={updateMutation.mutate}
      />

      <RemoveDialog
        onOpenChange={setIsRemoveOpen}
        isOpen={isRemoveOpen}
        mutationFn={removeMutation.mutate}
        order={order}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className='h-8 w-8 p-0 bg-transparent'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={onClick}>
          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
          <DropdownMenuItem id='status'>Status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem id='edit'>Edytuj</DropdownMenuItem>
          <DropdownMenuItem id='remove'>Usuń</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
