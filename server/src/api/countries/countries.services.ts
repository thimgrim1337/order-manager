import { eq } from 'drizzle-orm';
import db from '../../db/index';

export const countriesServices = {
  getCountriesQuery: () => db.query.country.findMany(),

  getCountryByIdQuery: (countryID: number) =>
    db.query.country.findFirst({
      where: (country) => eq(country.id, countryID),
    }),
};
