import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import loadingPlaces from './loadingPlaces';
import unloadingPlaces from './unloadingPlaces';
import address from './address';

const place = pgTable('place', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  addressID: integer('address_id')
    .notNull()
    .references(() => address.id),
});

export const placeRelations = relations(place, ({ one, many }) => ({
  address: one(address, {
    fields: [place.addressID],
    references: [address.id],
  }),
  loadingPlaces: many(loadingPlaces),
  unloadingPlaces: many(unloadingPlaces),
}));

export default place;
