import { DriverWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchDrivers(): Promise<DriverWithId[]> {
  const response = await fetch('api/v1/drivers');

  if (!response.ok) throw new Error("Can't fetch drivers");

  return (await response.json()) satisfies DriverWithId;
}

const driversQueryOptions = queryOptions({
  queryKey: ['drivers'],
  queryFn: () => fetchDrivers(),
});

export default driversQueryOptions;
