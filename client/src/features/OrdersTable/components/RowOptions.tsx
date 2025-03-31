import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderForm from '@/features/OrderForm/components/OrderForm';
import {
  removeOrder,
  updateOrder,
} from '@/features/OrderForm/mutations/orderMutation';
import { useToast } from '@/hooks/use-toast';
import { OrderCreate, OrderWithDetails } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import StatusDialog from './StatusDialog';
import EditDialog from './EditDialog';
import RemoveDialog from './RemoveDialog';

type TableRowDropdownProps = {
  order: OrderWithDetails;
};

export default function RowOptions({ order }: TableRowDropdownProps) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      const previousOrders = queryClient.getQueryData(['orders']);

      queryClient.setQueryData(['orders'], newOrder);

      return { previousOrders, newOrder };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(['orders'], context?.previousOrders);
      toast({
        title: 'Błąd',
        description: 'Nie udało się edytować zlecenia.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsEditOpen(false);
    },
    onSuccess: (newOrder) => {
      toast({
        title: 'Edycja zlecenia',
        description: `Edytowane zlecenie nr ${newOrder.orderNr}`,
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeOrder,
    onMutate: async (order) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      const previousOrders = queryClient.getQueryData(['orders']);

      queryClient.setQueryData(['orders'], (old: OrderCreate[] | undefined) => {
        if (!old) return [];

        return old.filter((o) => o.id !== order.id);
      });

      return { previousOrders };
    },
    onError: (err, orders, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
        console.log(err);
      }
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć zlecenia.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onSuccess: () => {
      toast({
        title: 'Usuwanie zlecenia',
        description: 'Pomyślnie usunięto zlecenie',
      });
    },
  });

  function handleClick(e: MouseEvent<HTMLElement>) {
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
      >
        <OrderForm
          values={order}
          mutationFn={updateMutation.mutate}
          isPending={updateMutation.isPending}
        />
      </EditDialog>

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
        <DropdownMenuContent align='end' onClick={handleClick}>
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
