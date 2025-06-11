import { OrderDetails } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchOrders(): Promise<OrderDetails[]> {
  const response = await fetch('api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies OrderDetails;
}

export const orderQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
});

export default orderQueryOptions;
