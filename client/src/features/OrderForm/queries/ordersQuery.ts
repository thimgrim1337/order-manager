import { Order } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('http://localhost:3000/api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies Order;
}

export const orderQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
});

export default orderQueryOptions;
