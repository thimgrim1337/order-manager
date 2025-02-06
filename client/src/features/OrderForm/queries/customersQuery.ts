import { Customer } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch('http://localhost:3000/api/v1/customers');

  if (!response.ok) throw new Error("Can't fetch customer from API.");

  return (await response.json()) satisfies Customer;
}

const customersQueryOptions = queryOptions({
  queryKey: ['customers'],
  queryFn: () => fetchCustomers(),
});

export default customersQueryOptions;
