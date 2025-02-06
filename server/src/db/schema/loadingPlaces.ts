import { integer, pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import order from './order';
import city from './city';
import { relations } from 'drizzle-orm';

const loadingPlaces = pgTable(
  'order_loading_places',
  {
    id: serial(),
    orderID: integer('order_id')
      .notNull()
      .references(() => order.id),
    placeID: integer('place_id')
      .notNull()
      .references(() => city.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderID, table.placeID] }),
  })
);

export const loadingPlacesRelations = relations(loadingPlaces, ({ one }) => ({
  order: one(order, {
    fields: [loadingPlaces.orderID],
    references: [order.id],
  }),
  place: one(city, {
    fields: [loadingPlaces.placeID],
    references: [city.id],
  }),
}));

export default loadingPlaces;
