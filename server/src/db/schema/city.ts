import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
import loadingPlaces from './loadingPlaces';
import unloadingPlaces from './unloadingPlaces';
import country from './country';

const city = pgTable(
  'city',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull().unique(),
    postal: varchar({ length: 10 }).notNull(),
    countryID: integer('country_id')
      .notNull()
      .references(() => country.id),
  },
  (table) => ({
    pk: unique('city_pk').on(table.name, table.postal, table.countryID),
  })
);

export const cityRelations = relations(city, ({ one, many }) => ({
  loadingPlaces: many(loadingPlaces),
  unloadingPlaces: many(unloadingPlaces),
  country: one(country, {
    fields: [city.countryID],
    references: [country.id],
  }),
}));

export default city;
