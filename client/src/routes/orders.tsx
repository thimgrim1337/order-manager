import { columns } from '@/features/OrdersTable/components/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import FormDialog from '@/components/ui/data-table/data-table-form-dialog';
import OrderForm from '@/features/OrderForm/components/OrderForm';
import { Suspense, useState } from 'react';
import orderQueryOptions from '@/features/OrderForm/queries/ordersQuery';

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orderQueryOptions),
  component: OrdersComponent,
});

function OrdersComponent() {
  const ordersQuery = useSuspenseQuery(orderQueryOptions);
  const { data } = ordersQuery;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='container mx-auto py-10'>
      <Suspense fallback={<h1>Loading orders...</h1>}>
        <div className='flex justify-end'>
          <FormDialog
            triggerText='Dodaj zlecenie'
            title='Dodaj nowe zlecenie'
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          >
            <OrderForm onOpenChange={setIsOpen} />
          </FormDialog>
        </div>
        <DataTable
          columns={columns}
          data={data}
          searchInputPlaceholder='Filtruj zlecenia...'
        />
      </Suspense>
    </div>
  );
}
