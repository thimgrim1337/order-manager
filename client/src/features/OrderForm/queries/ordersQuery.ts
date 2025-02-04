import { Order } from '@/types/order';
import { queryOptions } from '@tanstack/react-query';

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('http://localhost:3000/api/v1/orders');

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return response.json();
}

export const orderQueryOptions = queryOptions({
  queryKey: ['orders'],
  queryFn: () => fetchOrders(),
});

export default orderQueryOptions;
