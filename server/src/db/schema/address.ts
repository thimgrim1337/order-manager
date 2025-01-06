import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
import country from './country';

const address = pgTable(
  'address',
  {
    id: serial().primaryKey(),
    street: varchar({ length: 255 }).notNull(),
    streetNr: varchar('street_nr', { length: 10 }).notNull(),
    postal: varchar({ length: 10 }).notNull(),
    city: varchar({ length: 20 }).notNull(),
    countryID: integer('country_id')
      .notNull()
      .references(() => country.id),
  },
  (table) => ({
    pk: unique().on(table.street, table.streetNr, table.city, table.countryID),
  })
);

export const addressRelations = relations(address, ({ one }) => ({
  country: one(country, {
    fields: [address.countryID],
    references: [country.id],
  }),
}));

export default address;
