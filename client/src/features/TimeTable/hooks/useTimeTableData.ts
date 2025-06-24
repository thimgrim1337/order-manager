import { useSuspenseQueries } from '@tanstack/react-query';
import { getOrdersQueryOptions } from '../queries/ordersQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';

export function useTimeTableData(
  truckId: number,
  firstDay: Date,
  lastDay: Date
) {
  const [{ data: orders }, { data: trucks }, { data: countries }] =
    useSuspenseQueries({
      queries: [
        getOrdersQueryOptions(truckId, firstDay, lastDay),
        trucksQueryOptions,
        countriesQueryOptions,
      ],
    });

  return { orders, trucks, countries };
}
