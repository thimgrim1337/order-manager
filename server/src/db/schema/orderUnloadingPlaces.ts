import { integer, pgTable, primaryKey, serial } from 'drizzle-orm/pg-core';
import order from './order';
import place from './place';
import { relations } from 'drizzle-orm';

const orderUnloadingPlaces = pgTable(
  'order_unloading_places',
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

export const orderUnloadingPlacesRelations = relations(
  orderUnloadingPlaces,
  ({ one }) => ({
    order: one(order, {
      fields: [orderUnloadingPlaces.orderID],
      references: [order.id],
    }),
    place: one(place, {
      fields: [orderUnloadingPlaces.placeID],
      references: [place.id],
    }),
  })
);

export default orderUnloadingPlaces;
