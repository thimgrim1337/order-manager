import { cleanEmptyParams } from '@/features/OrdersTable/hooks/useFilters';
import { CustomerFilters, CustomerWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCustomers(
  searchQuery?: CustomerFilters
): Promise<CustomerWithId[]> {
  console.log(searchQuery);
  const queryString = searchQuery
    ? `?searchQuery=${searchQuery?.searchQuery}`
    : undefined;

  const response = await fetch(`api/v1/customers${queryString}`);

  if (!response.ok) throw new Error("Can't fetch customer from API.");

  return (await response.json()) satisfies CustomerWithId;
}

export const getCustomersQueryOptions = (searchQuery?: CustomerFilters) => {
  const searchKey = searchQuery && cleanEmptyParams(searchQuery);

  return queryOptions({
    queryKey: ['customers', searchKey],
    queryFn: () => fetchCustomers(searchQuery),
  });
};

export default getCustomersQueryOptions;
