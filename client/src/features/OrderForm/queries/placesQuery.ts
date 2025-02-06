import { Place } from '@/server/src/api/places/places.model';
import { queryOptions } from '@tanstack/react-query';

async function fetchPlaces(): Promise<Place[]> {
  const response = await fetch('http://localhost:3000/api/v1/places');

  if (!response.ok) throw new Error("Can't fetch data");

  return (await response.json()) satisfies Place;
}

const placesQueryOptions = queryOptions({
  queryKey: ['places'],
  queryFn: () => fetchPlaces(),
});

export default placesQueryOptions;
