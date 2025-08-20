import { cleanEmptyParams } from '@/features/OrdersTable/hooks/useFilters';
import { CustomerFilters, CustomerWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCustomers(
  id?: number,
  searchQuery?: CustomerFilters
): Promise<CustomerWithId[]> {
  const queryString = searchQuery?.searchQuery
    ? `?searchQuery=${searchQuery.searchQuery} `
    : '';

  let response;
  if (queryString) {
    response = await fetch(`api/v1/customers${queryString}`);
  } else if (id) {
    response = await fetch(`api/v1/customers/${id}`);
  } else {
    response = await fetch(`api/v1/customers`);
  }

  if (!response.ok) throw new Error("Can't fetch customer from API.");

  return (await response.json()) satisfies CustomerWithId;
}

export const getCustomersQueryOptions = (
  id?: number,
  searchQuery?: CustomerFilters
) => {
  const searchKey = searchQuery && cleanEmptyParams(searchQuery);

  return queryOptions({
    queryKey: ['customers', searchKey, id],
    queryFn: () => fetchCustomers(id, searchQuery),
  });
};

export default getCustomersQueryOptions;
