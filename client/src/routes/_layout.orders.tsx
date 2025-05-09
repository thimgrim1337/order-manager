import { columns } from '@/features/OrdersTable/columns';
import { DataTable } from '@/features/OrdersTable/components/data-table/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/primitives/dialog';
import OrderForm from '@/features/OrderForm/components/order-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import orderQueryOptions from '@/features/OrderForm/queries/ordersQuery';
import { createOrder } from '@/features/OrderForm/mutations/orderMutation';
import { useCreateMutation } from '@/features/OrderForm/hooks/useCreateMutation';
import customersQueryOptions from '@/features/OrderForm/queries/customersQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import driversQueryOptions from '@/features/OrderForm/queries/driversQuery';
import { Order } from '@/types/types';

export const Route = createFileRoute('/_layout/orders')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(orderQueryOptions),
      queryClient.ensureQueryData(customersQueryOptions),
      queryClient.ensureQueryData(countriesQueryOptions),
      queryClient.ensureQueryData(trucksQueryOptions),
      queryClient.ensureQueryData(driversQueryOptions),
    ]),

  pendingComponent: () => <h4>Loading...</h4>,
  component: OrdersPage,
});

function OrdersPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: orders } = useSuspenseQuery(orderQueryOptions);

  const { createMutation } = useCreateMutation<Order>({
    mutationFn: createOrder,
    queryKey: ['orders'],
    toastDescription: 'Dodano nowe zlecenie.',
    toastTitle: 'Nowe zlecenie.',
    errorDescription: 'Nie udało się dodać nowego zlecenia. Spróbuj ponownie.',
    onOpenDialogChange: setIsOpen,
  });

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-end'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className='text-primary-foreground'>
            Dodaj zlecenie
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowe zlecenie</DialogTitle>
              <DialogDescription>
                Wypełnij wszystkie pola aby dodać nowe zlecenie.
              </DialogDescription>
            </DialogHeader>
            <OrderForm<Order>
              mutationFn={createMutation.mutate}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        searchInputPlaceholder='Filtruj zlecenia...'
      />
    </div>
  );
}
