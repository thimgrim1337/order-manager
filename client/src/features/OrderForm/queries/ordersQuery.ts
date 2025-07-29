import { stateToFilters } from '@/lib/utils';
import { OrderFilters, OrderWithDetails, WithRowCount } from '@/types/types';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

async function fetchOrders(
  filtersAndPagination: OrderFilters
): Promise<WithRowCount<OrderWithDetails>> {
  const filters = stateToFilters(filtersAndPagination);

  const response = await fetch(`api/v1/orders?${filters}`);

  if (!response.ok) throw new Error("Can't fetch orders form API.");

  return (await response.json()) as WithRowCount<OrderWithDetails>;
}

export const getOrderQueryOptions = (filters: OrderFilters) =>
  queryOptions({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    placeholderData: keepPreviousData,
  });

export default getOrderQueryOptions;
