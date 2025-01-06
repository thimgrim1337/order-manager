import { integer, pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import order from './order';
import place from './place';
import { relations } from 'drizzle-orm';

const orderLoadingPlaces = pgTable(
  'order_loading_places',
  {
    id: serial(),
    orderID: integer('order_id')
      .notNull()
      .references(() => order.id),
    placeID: integer('place_id')
      .notNull()
      .references(() => place.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderID, table.placeID] }),
  })
);

export const orderLoadingPlacesRelations = relations(
  orderLoadingPlaces,
  ({ one }) => ({
    order: one(order, {
      fields: [orderLoadingPlaces.orderID],
      references: [order.id],
    }),
    place: one(place, {
      fields: [orderLoadingPlaces.placeID],
      references: [place.id],
    }),
  })
);

export default orderLoadingPlaces;
