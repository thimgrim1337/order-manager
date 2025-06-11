import {
  getNextMonday,
  getPreviousFriday,
  getWeekNumber,
} from '@/helpers/dates';
import { OrderDetails } from '@/types/types';

export async function fetchOrdersByTruckAndDates(
  truckId: number,
  startDate: string | undefined,
  endDate: string | undefined
): Promise<OrderDetails[]> {
  const startDateQuery = startDate ? `&startDate=${startDate}` : '';
  const endDateQuery = endDate ? `&endDate=${endDate}` : '';

  const response = await fetch(
    `api/v1/orders?truckId=${truckId}${startDateQuery}${endDateQuery}`
  );

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies OrderDetails;
}

export const getOrdersQueryOptions = (
  truckId: number,
  start: string,
  end: string
) => ({
  queryKey: ['orders', truckId, getWeekNumber(start)],
  queryFn: () =>
    fetchOrdersByTruckAndDates(
      truckId,
      getPreviousFriday(start),
      getNextMonday(end)
    ),
});
