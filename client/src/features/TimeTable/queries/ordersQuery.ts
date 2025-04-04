import { OrderWithDetails } from '@/types/types';

export async function fetchOrders(
  truckId: number,
  startDate: string | undefined,
  endDate: string | undefined
): Promise<OrderWithDetails[]> {
  const startDateQuery = startDate ? `&startDate=${startDate}` : '';
  const endDateQuery = endDate ? `&endDate=${endDate}` : '';

  const response = await fetch(
    `http://localhost:3000/api/v1/orders?truckId=${truckId}${startDateQuery}${endDateQuery}`
  );

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies OrderWithDetails;
}
