import { useSuspenseQuery } from '@tanstack/react-query';
import { getOrdersQueryOptions } from '../queries/ordersQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';

export function useTimeTableData(
  truckId: number,
  firstDay: string,
  lastDay: string
) {
  const { data: orders } = useSuspenseQuery(
    getOrdersQueryOptions(truckId, firstDay, lastDay)
  );
  const { data: trucks } = useSuspenseQuery(trucksQueryOptions);
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);

  return { orders, trucks, countries };
}
