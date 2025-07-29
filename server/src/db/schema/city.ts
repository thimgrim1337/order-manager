import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  unique,
  text,
} from 'drizzle-orm/pg-core';
import loadingPlaces from './loadingPlaces';
import unloadingPlaces from './unloadingPlaces';
import country from './country';

const city = pgTable(
  'cities',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    postal: text().notNull(),
    countryID: integer('country_id')
      .notNull()
      .references(() => country.id),
  },
  (table) => [
    unique().on(table.name, table.postal, table.countryID),
    index('idx_cities_name_lower').using('btree', sql`LOWER(${table.name})`),
  ]
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
