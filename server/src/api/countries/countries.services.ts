import { eq } from 'drizzle-orm';
import db from '../../db/index';

export const countriesServices = {
  getCountriesQuery: () => db.query.country.findMany(),

  getCountryByIdQuery: (countryID: number) => {
    if (!countryID || countryID < 1)
      throw new Error('CountryID must be provided and higher than 0.');

    return db.query.country.findFirst({
      where: (country) => eq(country.id, countryID),
    });
  },
};
