import { CustomerWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCustomers(): Promise<CustomerWithId[]> {
  const response = await fetch('api/v1/customers');

  if (!response.ok) throw new Error("Can't fetch customer from API.");

  return (await response.json()) satisfies CustomerWithId;
}

const customersQueryOptions = queryOptions({
  queryKey: ['customers'],
  queryFn: () => fetchCustomers(),
});

export default customersQueryOptions;
