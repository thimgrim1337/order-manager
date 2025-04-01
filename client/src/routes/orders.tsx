import { columns } from '@/features/OrdersTable/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import OrderForm from '@/features/OrderForm/components/OrderForm';
import { Suspense, useState } from 'react';
import orderQueryOptions from '@/features/OrderForm/queries/ordersQuery';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/features/OrderForm/mutations/orderMutation';
import CreateDialog from '@/features/OrdersTable/components/CreateDialog';

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orderQueryOptions),
  component: OrdersComponent,
});

function OrdersComponent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ordersQuery = useSuspenseQuery(orderQueryOptions);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: orders } = ordersQuery;

  const createMutation = useMutation({
    mutationFn: createOrder,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      const previousOrders = queryClient.getQueryData(['orders']);

      if (previousOrders)
        queryClient.setQueryData(['orders'], { ...previousOrders, newOrder });

      return { previousOrders };
    },
    onError: (err, newOrder, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
        console.log(err);
      }
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać nowego zlecenia.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsOpen(false);
    },
    onSuccess: () => {
      toast({
        title: 'Nowe zlecenie',
        description: 'Dodano nowe zlecenie',
      });
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <Suspense fallback={<h1>Loading orders...</h1>}>
        <div className='flex justify-end'>
          <CreateDialog onOpenChange={setIsOpen} isOpen={isOpen}>
            <OrderForm
              mutationFn={createMutation.mutate}
              isPending={createMutation.isPending}
            ></OrderForm>
          </CreateDialog>
        </div>
        <DataTable
          columns={columns}
          data={orders}
          searchInputPlaceholder='Filtruj zlecenia...'
        />
      </Suspense>
    </div>
  );
}
