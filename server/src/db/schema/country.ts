import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

import city from './city';

const country = pgTable('country', {
  id: serial().primaryKey(),
  name: varchar({ length: 45 }).notNull().unique(),
  code: varchar({ length: 2 }).notNull().unique(),
});

export const countryRelations = relations(country, ({ many }) => ({
  cities: many(city),
}));

export default country;
