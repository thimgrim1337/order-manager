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

  getCityByIdQuery: (cityID: number) => {
    if (!cityID || cityID < 1)
      throw new Error('CityID must be provided and higher than 0.');

    return db.query.city.findFirst({
      where: (city) => eq(city.id, cityID),
      with: {
        country: {
          columns: {
            id: false,
          },
        },
      },
    });
  },

  getCityByNameQuery: (cityName: string) => {
    if (!cityName.trim()) throw new Error('City name is required.');

    return db.query.city.findFirst({
      where: (city, { ilike }) => ilike(city.name, cityName),
      with: {
        country: {
          columns: {
            id: false,
          },
        },
      },
    });
  },
  createCityQuery: async (newCity: City) => {
    const cityName = newCity.name?.trim();

    if (!cityName) throw new Error('City name is required.');

    const cityData = {
      ...newCity,
      name: cityName,
    };

    const result = await db.insert(city).values(cityData).returning();

    return result[0];
  },

  deleteCityQuery: async (cityID: number) => {
    if (!cityID || cityID < 1)
      throw new Error('CityID must be provided and higher than 0.');

    const result = await db.delete(city).where(eq(city.id, cityID)).returning();

    if (result.length === 0) throw new Error('City not found');

    return result[0];
  },

  updateCityQuery: async (cityID: number, newCityData: Partial<City>) => {
    if (!cityID || cityID < 1)
      throw new Error('CityID must be provided and higher than 0.');

    if (!newCityData.name?.trim() && newCityData.name === undefined)
      throw new Error('City name cannot be empty.');

    const updateData = {
      ...newCityData,
      ...(newCityData.name && { name: newCityData.name.trim() }),
    };

    const result = await db
      .update(city)
      .set(updateData)
      .where(eq(city.id, cityID))
      .returning();

    if (result.length === 0) throw new Error('City not found.');

    return result[0];
  },
};
