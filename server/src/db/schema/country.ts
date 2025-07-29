import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

import city from './city';

const country = pgTable('countries', {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  code: text().notNull().unique(),
});

export const countryRelations = relations(country, ({ many }) => ({
  cities: many(city),
}));

export default country;
