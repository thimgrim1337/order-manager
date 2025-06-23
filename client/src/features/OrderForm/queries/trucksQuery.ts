import { TruckWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchTrucks(): Promise<TruckWithId[]> {
  const response = await fetch('api/v1/trucks');

  if (!response.ok) throw new Error("Can't fetch data");

  return (await response.json()) satisfies TruckWithId;
}

const trucksQueryOptions = queryOptions({
  queryKey: ['trucks'],
  queryFn: () => fetchTrucks(),
});

export default trucksQueryOptions;
