import { Customer } from '@/types/customer';
import { queryOptions } from '@tanstack/react-query';

async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch('http://localhost:3000/api/v1/customers');

  if (!response.ok) throw new Error("Can't fetch data");

  return await response.json();
}

const customersQueryOptions = queryOptions({
  queryKey: ['customers'],
  queryFn: () => fetchCustomers(),
});

export default customersQueryOptions;
