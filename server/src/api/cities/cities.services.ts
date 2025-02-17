import { and, eq } from 'drizzle-orm';
import db from '../../db/index';
import { city } from '../../db/schema/index';
import { City } from './cities.model';

export const citiesServices = {
  getCitiesQuery: () =>
    db.query.city.findMany({
      with: {
        country: {
          columns: {
            id: false,
          },
        },
      },
    }),

  getCityByIdQuery: (cityID: number) =>
    db.query.city.findFirst({
      where: (city) => eq(city.id, cityID),
      with: {
        country: {
          columns: {
            id: false,
          },
        },
      },
    }),
  getCityByNameQuery: (cityName: string) =>
    db.query.city.findFirst({
      where: (city) => eq(city.name, cityName),
    }),
  addCityQuery: (newCity: City) => db.insert(city).values(newCity).returning(),
  deleteCityQuery: (cityID: number) =>
    db.delete(city).where(eq(city.id, cityID)).returning(),
  updateCityQuery: (cityID: number, cityToUpdate: City) =>
    db.update(city).set(cityToUpdate).where(eq(city.id, cityID)).returning(),
};
