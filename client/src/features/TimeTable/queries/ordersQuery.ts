import {
  formatDate,
  getNextMonday,
  getPreviousFriday,
  getWeekNumber,
} from '@/helpers/dates';
import { OrderWithDetails } from '@/types/types';

export async function fetchOrdersByTruckAndDates(
  truckId: number,
  start: Date | undefined,
  end: Date | undefined
): Promise<OrderWithDetails[]> {
  const startDate = start ? `&startDate=${formatDate(start)}` : '';
  const endDate = end ? `&endDate=${formatDate(end)}` : '';

  const response = await fetch(
    `api/v1/orders?truckId=${truckId}${startDate}${endDate}`
  );

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) satisfies OrderWithDetails;
}

export const getOrdersQueryOptions = (
  truckId: number,
  start: Date,
  end: Date
) => {
  return {
    queryKey: ['orders', truckId, getWeekNumber(start)],
    queryFn: () =>
      fetchOrdersByTruckAndDates(
        truckId,
        getPreviousFriday(start),
        getNextMonday(end)
      ),
  };
};
