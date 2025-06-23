import { OrderWithDetails } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchOrders(): Promise<OrderWithDetails[]> {
  const response = await fetch('api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies OrderWithDetails;
}

export const orderQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
});

export default orderQueryOptions;
