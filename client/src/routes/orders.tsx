import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

function fetchOrders() {
  return ['Order1', 'Order2'];
}

const queryOptions = {
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
};

export const Route = createFileRoute('/orders')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(queryOptions),
  component: OrdersComponent,
});

function OrdersComponent() {
  const ordersQuery = useSuspenseQuery(queryOptions);
  const orders = ordersQuery.data;

  console.log(orders);
  return <div>Hello "/orders"!</div>;
}
