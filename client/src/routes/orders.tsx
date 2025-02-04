import { columns } from '@/features/OrdersTable/components/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import FormDialog from '@/components/ui/data-table/data-table-form-dialog';
import OrderForm from '@/features/OrderForm/components/new-order-form';
import { Suspense, useState } from 'react';
import orderQueryOptions from '@/features/OrderForm/queries/ordersQuery';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orderQueryOptions),
  component: OrdersComponent,
  errorComponent: ({ error }) => <div>${error.message}</div>,
});

function OrdersComponent() {
  const ordersQuery = useSuspenseQuery(orderQueryOptions);
  const { data } = ordersQuery;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p className='p-2'>There was an error!</p>
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
              <pre className='whitespace-normal'>{error.message}</pre>
            </div>
          )}
          onReset={reset}
        >
          <div className='container mx-auto py-10'>
            <Suspense fallback={<h1>Loading orders...</h1>}>
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
              <DataTable
                columns={columns}
                data={data}
                searchInputPlaceholder='Filtruj zlecenia...'
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
