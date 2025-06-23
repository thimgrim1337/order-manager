import { columns } from '@/features/OrdersTable/components/data-table/columns';
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
import { useOptimisticMutation } from '@/features/OrderForm/hooks/useOptimisticMutation';
import customersQueryOptions from '@/features/OrderForm/queries/customersQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import driversQueryOptions from '@/features/OrderForm/queries/driversQuery';
import { Order } from '@/types/types';
import { Button } from '@/components/ui/primitives/button';

export const Route = createFileRoute('/_layout/orders')({
  loader: ({ context: { queryClient } }) =>
    Promise.allSettled([
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

  const createMutation = useOptimisticMutation<Order>({
    mutationFn: createOrder,
    queryKey: ['orders'],
    successMessage: 'Dodano nowe zlecenie.',
    errorMessage: 'Nie udało się dodać nowego zlecenia. Spróbuj ponownie.',
  });

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-end mb-4'>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Dodaj zlecenie</Button>
          </DialogTrigger>

          <DialogContent className='max-w-screen-lg'>
            <DialogHeader>
              <DialogTitle>Dodaj nowe zlecenie</DialogTitle>
              <DialogDescription>
                Wypełnij wszystkie pola aby dodać nowe zlecenie.
              </DialogDescription>
            </DialogHeader>
            <OrderForm<Order>
              onOpenChange={setIsOpen}
              mutation={createMutation}
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
