import { Driver } from '@/types/driver';
import { queryOptions } from '@tanstack/react-query';

async function fetchDrivers(): Promise<Driver[]> {
  const response = await fetch('http://localhost:3000/api/v1/drivers');

  if (!response.ok) throw new Error("Can't fetch data");

  return await response.json();
}

const driversQueryOptions = queryOptions({
  queryKey: ['drivers'],
  queryFn: () => fetchDrivers(),
});

export default driversQueryOptions;
