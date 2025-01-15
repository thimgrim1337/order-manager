import { relations, sql } from 'drizzle-orm';
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
  priceCurrency: numeric('price_currency', {
    precision: 10,
    scale: 2,
  }).notNull(),
  pricePLN: numeric('price_pln', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('PLN'),
  currencyRate: numeric('currency_rate', { precision: 10, scale: 4 }).default(
    '0'
  ),
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
