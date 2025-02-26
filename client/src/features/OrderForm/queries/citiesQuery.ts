import { City } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCities(): Promise<City[]> {
  const response = await fetch('http://localhost:3000/api/v1/cities');

  if (!response.ok) throw new Error("Can't fetch city data");

  return (await response.json()) satisfies City;
}

const citiesQueryOptions = queryOptions({
  queryKey: ['cities'],
  queryFn: () => fetchCities(),
});

export default citiesQueryOptions;
