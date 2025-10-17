import { City } from '../cities.model';
import { citiesServices } from '../cities.services';

export default async function getCitiesIds(places: City[]): Promise<number[]> {
  if (!places || !Array.isArray(places))
    throw new Error('Invalid places array provided.');

  if (places.length === 0) return [];

  try {
    const results = await Promise.all(
      places.map(async (place): Promise<number> => {
        const placeName = place.name.trim();

        if (place.id && typeof place.id === 'number') return place.id;

        const existingCity = await citiesServices.getCityByNameQuery(placeName);

        if (existingCity?.id) return existingCity.id;

        const newCity = await citiesServices.createCityQuery({
          ...place,
          name: placeName,
        });

        if (!newCity?.id)
          throw new Error(`Failed to create city: ${placeName}`);

        return newCity.id;
      })
    );
    return results;
  } catch (error) {
    throw new Error(`Failed to process cities: ${error}`);
  }
}
