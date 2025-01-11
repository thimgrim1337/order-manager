import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  varchar,
  date,
  numeric,
} from 'drizzle-orm/pg-core';
import status from './status';
import truck from './truck';
import driver from './driver';
import customer from './customer';
import orderLoadingPlaces from './orderLoadingPlaces';
import orderUnloadingPlaces from './orderUnloadingPlaces';

const order = pgTable('order', {
  id: serial().primaryKey(),
  orderNr: varchar('order_nr', { length: 30 }).notNull(),
  startDate: date('start_date', { mode: 'string' }).notNull().defaultNow(),
  endDate: date('end_date', { mode: 'string' }).notNull().defaultNow(),
  statusID: integer('status_id')
    .notNull()
    .references(() => status.id),
  price: numeric({ precision: 7, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('PLN'),
  truckID: integer('truck_id')
    .notNull()
    .references(() => truck.id),
  driverID: integer('driver_id')
    .notNull()
    .references(() => driver.id),
  customerID: integer('customer_id')
    .notNull()
    .references(() => customer.id),
});

export const orderRelations = relations(order, ({ one, many }) => ({
  status: one(status, {
    fields: [order.statusID],
    references: [status.id],
  }),
  truck: one(truck, {
    fields: [order.truckID],
    references: [truck.id],
  }),
  driver: one(driver, {
    fields: [order.driverID],
    references: [driver.id],
  }),
  customer: one(customer, {
    fields: [order.customerID],
    references: [customer.id],
  }),
  orderLoadingPlaces: many(orderLoadingPlaces),
  orderUnloadingPlaces: many(orderUnloadingPlaces),
}));

export default order;
