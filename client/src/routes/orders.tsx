import { columns } from '@/components/OrdersTable/columns';
import { DataTable } from '@/components/ui/data-table';
import { Order } from '@/types/order';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('http://localhost:3000/api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch data");

  return response.json();
}

const queryOptions = {
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
};

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(queryOptions),
  component: OrdersComponent,
  errorComponent: ({ error }) => <div>${error.message}</div>,
});

function OrdersComponent() {
  const ordersQuery = useSuspenseQuery(queryOptions);
  const { data, isError } = ordersQuery;

  return (
    <div className='container mx-auto py-10'>
      {isError && <div>An errror occured. !</div>}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
