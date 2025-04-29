import { columns } from '@/features/OrdersTable/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import OrderForm from '@/features/OrderForm/components/order-form';
import { useState } from 'react';
import orderQueryOptions from '@/features/OrderForm/queries/ordersQuery';
import { createOrder } from '@/features/OrderForm/mutations/orderMutation';
import { useCreateMutation } from '@/features/OrderForm/hooks/useCreateMutation';
import Dialog from '@/components/ui/dialog/dialog';
import customersQueryOptions from '@/features/OrderForm/queries/customersQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import { Order } from '@/types/types';

export const Route = createFileRoute('/_layout/orders')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(orderQueryOptions),
      queryClient.ensureQueryData(customersQueryOptions),
      queryClient.ensureQueryData(countriesQueryOptions),
    ]),

  pendingComponent: () => <h1>Loading...</h1>,
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
  });

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-end'>
        <Dialog
          onOpenChange={setIsOpen}
          isOpen={isOpen}
          trigger='Dodaj zlecenie'
          title='Dodaj nowe zlecenie'
          description='Wypełnij wszystkie pola aby dodać nowe zlecenie.'
          className='max-w-screen-lg'
        >
          <OrderForm<Order>
            mutationFn={createMutation.mutate}
            isPending={createMutation.isPending}
          />
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
