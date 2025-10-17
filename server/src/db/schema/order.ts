import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  text,
  date,
  numeric,
  timestamp,
  index,
  pgView,
  json,
} from 'drizzle-orm/pg-core';
import status from './status';
import truck from './truck';
import driver from './driver';
import customer from './customer';
import loadingPlaces from './loadingPlaces';
import unloadingPlaces from './unloadingPlaces';
import { CityWithId } from '@/api/cities/cities.model';

const order = pgTable(
  'orders',
  {
    id: serial().primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    orderNr: text('order_nr').notNull(),
    startDate: date('start_date', { mode: 'string' }).notNull().defaultNow(),
    endDate: date('end_date', { mode: 'string' }).notNull().defaultNow(),
    statusID: integer('status_id')
      .notNull()
      .references(() => status.id),
    priceCurrency: numeric('price_currency', {
      precision: 10,
      scale: 2,
    }).notNull(),
    pricePLN: numeric('price_pln', {
      precision: 10,
      scale: 2,
    }).notNull(),
    currency: text('currency').notNull().default('PLN'),
    currencyRate: numeric('currency_rate', {
      precision: 5,
      scale: 4,
    }).notNull(),
    truckID: integer('truck_id')
      .notNull()
      .references(() => truck.id),
    driverID: integer('driver_id')
      .notNull()
      .references(() => driver.id),
    customerID: integer('customer_id')
      .notNull()
      .references(() => customer.id),
  },
  (table) => [
    index('idx_orders_order_nr_lower').using(
      'btree',
      sql`LOWER(${table.orderNr})`
    ),
    index('idex_orders_start_date_date').using(
      'btree',
      sql`DATE(${table.startDate})`
    ),
    index('idex_orders_end_date_date').using(
      'btree',
      sql`DATE(${table.endDate})`
    ),
  ]
);

export const ordersWithDetailsView = pgView('orders_with_details', {
  id: serial().primaryKey(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  orderNr: text('order_nr'),
  startDate: date('start_date', { mode: 'string' }).notNull().defaultNow(),
  endDate: date('end_date', { mode: 'string' }).notNull().defaultNow(),
  statusID: integer('status_id')
    .notNull()
    .references(() => status.id),
  priceCurrency: numeric('price_currency', {
    precision: 10,
    scale: 2,
  }).notNull(),
  pricePLN: numeric('price_pln', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('PLN'),
  currencyRate: numeric('currency_rate', {
    precision: 5,
    scale: 4,
  }).notNull(),
  truckID: integer('truck_id')
    .notNull()
    .references(() => truck.id),
  driverID: integer('driver_id')
    .notNull()
    .references(() => driver.id),
  customerID: integer('customer_id')
    .notNull()
    .references(() => customer.id),

  // Joined data
  customer: text('customer_name'),
  driver: text('driver_name'),
  truck: text('truck_plate'),
  status: text('status_name'),

  // JSON aggregated data
  loadingPlaces: json('loading_places').$type<CityWithId[]>(),
  unloadingPlaces: json('unloading_places').$type<CityWithId[]>(),

  // Helper columns for sorting
  loadingCity: text('loading_city'),
  unloadingCity: text('unloading_city'),
}).existing();

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
  loadingPlaces: many(loadingPlaces),
  unloadingPlaces: many(unloadingPlaces),
}));

export default order;
