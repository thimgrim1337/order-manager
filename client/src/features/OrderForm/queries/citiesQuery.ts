import { CityWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCities(): Promise<CityWithId[]> {
  const response = await fetch('api/v1/cities');

  if (!response.ok) throw new Error("Can't fetch city data");

  return (await response.json()) satisfies CityWithId;
}

const citiesQueryOptions = queryOptions({
  queryKey: ['cities'],
  queryFn: () => fetchCities(),
});

export default citiesQueryOptions;
