import { Truck } from '@/server/src/api/trucks/trucks.model';
import { queryOptions } from '@tanstack/react-query';

async function fetchTrucks(): Promise<Truck[]> {
  const response = await fetch('http://localhost:3000/api/v1/trucks');

  if (!response.ok) throw new Error("Can't fetch data");

  return (await response.json()) satisfies Truck;
}

const trucksQueryOptions = queryOptions({
  queryKey: ['trucks'],
  queryFn: () => fetchTrucks(),
});

export default trucksQueryOptions;
