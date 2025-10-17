import { relations, sql } from 'drizzle-orm';
import {
  serial,
  pgTable,
  text,
  date,
  integer,
  AnyPgColumn,
  index,
} from 'drizzle-orm/pg-core';
import order from './order';
import driver from './driver';

const truck = pgTable(
  'trucks',
  {
    id: serial().primaryKey(),
    plate: text().unique().notNull(),
    insuranceEndAt: date('insurance_endAt').notNull().defaultNow(),
    serviceEndAt: date('service_endAt').notNull().defaultNow(),
  },
  (table) => [
    index('idx_trucks_plate_lower').using('btree', sql`LOWER(${table.plate})`),
  ]
);

export const truckRelations = relations(truck, ({ many }) => ({
  orders: many(order),
}));

export default truck;
