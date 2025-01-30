import { columns } from '@/features/OrdersTable/components/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Order } from '@/types/order';
import FormDialog from '@/components/ui/data-table/data-table-form-dialog';
import OrderForm from '@/features/OrderForm/components/new-order-form';
import { useState } from 'react';

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('http://localhost:3000/api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch data");

  return response.json();
}

const orderQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
});

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orderQueryOptions),
  component: OrdersComponent,
  errorComponent: ({ error }) => <div>${error.message}</div>,
});

function OrdersComponent() {
  const ordersQuery = useSuspenseQuery(orderQueryOptions);
  const { data, isError } = ordersQuery;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-end'>
        <FormDialog
          dialogTriggerText='Dodaj zlecenie'
          dialogTitle='Dodaj nowe zlecenie'
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <OrderForm setIsOpen={setIsOpen} />
        </FormDialog>
      </div>
      {isError && <div>An errror occured. !</div>}
      <DataTable
        columns={columns}
        data={data}
        searchInputPlaceholder='Filtruj zlecenia...'
      />
    </div>
  );
}
