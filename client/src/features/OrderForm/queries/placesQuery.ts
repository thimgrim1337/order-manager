import { Place } from '@/types/place';
import { queryOptions } from '@tanstack/react-query';

async function fetchPlaces(): Promise<Place[]> {
  const response = await fetch('http://localhost:3000/api/v1/places');

  if (!response.ok) throw new Error("Can't fetch data");

  return await response.json();
}

const placesQueryOptions = queryOptions({
  queryKey: ['places'],
  queryFn: () => fetchPlaces(),
});

export default placesQueryOptions;
