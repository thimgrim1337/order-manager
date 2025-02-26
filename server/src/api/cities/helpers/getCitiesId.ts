import { City } from '../cities.model';
import { citiesServices } from '../cities.services';

export default async function getCitiesId(places: City[]) {
  return await Promise.all(
    places.map(async (place) => {
      if (place.id) return place.id;

      const existingCity = await citiesServices.getCityByNameQuery(place.name);

      if (!existingCity) {
        const newCity = await citiesServices.addCityQuery(place);
        return newCity[0]?.id;
      }

      return existingCity.id;
    })
  );
}
