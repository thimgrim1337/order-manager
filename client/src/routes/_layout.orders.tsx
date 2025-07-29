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
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { getOrderQueryOptions } from '@/features/OrderForm/queries/ordersQuery';
import { createOrder } from '@/features/OrderForm/mutations/orderMutation';
import { useOptimisticMutation } from '@/features/OrderForm/hooks/useOptimisticMutation';
import customersQueryOptions from '@/features/OrderForm/queries/customersQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import driversQueryOptions from '@/features/OrderForm/queries/driversQuery';
import { Order, OrderFilters } from '@/types/types';
import { Button } from '@/components/ui/primitives/button';
import { LoaderCircleIcon } from 'lucide-react';
import { useFilters } from '@/features/OrdersTable/hooks/useFilters';

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;

export const Route = createFileRoute('/_layout/orders')({
  loaderDeps: ({ search }) => ({
    pageSize: search.pageSize,
    pageIndex: search.pageIndex,
  }),
  loader: async ({
    context: { queryClient },
    deps: { pageSize, pageIndex },
  }) => {
    Promise.allSettled([
      queryClient.ensureQueryData(
        getOrderQueryOptions({ pageSize: 10, pageIndex: 0 })
      ),
      queryClient.ensureQueryData(customersQueryOptions),
      queryClient.ensureQueryData(countriesQueryOptions),
      queryClient.ensureQueryData(trucksQueryOptions),
      queryClient.ensureQueryData(driversQueryOptions),
    ]);
    return { pageSize, pageIndex };
  },

  validateSearch: (search: OrderFilters) => OrderFilters.parse(search),
  component: OrdersPage,
});

function OrdersPage() {
  const { filters } = useFilters('/_layout/orders');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: orders, isFetching } = useQuery(getOrderQueryOptions(filters));

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
        data={(orders && orders.data) || []}
        rowCount={(orders && orders.rowCount) || 0}
        searchInputPlaceholder='Filtruj zlecenia...'
      />
      {isFetching && <LoaderCircleIcon className='animate-spin' />}
    </div>
  );
}
