import { CountryWithId } from '@/types/types';
import { queryOptions } from '@tanstack/react-query';

async function fetchCountries(): Promise<CountryWithId[]> {
  const response = await fetch('http://localhost:3000/api/v1/countries');

  if (!response.ok) throw new Error("Can't fetch city data");

  return (await response.json()) satisfies CountryWithId;
}

const countriesQueryOptions = queryOptions({
  queryKey: ['countries'],
  queryFn: () => fetchCountries(),
});

export default countriesQueryOptions;
