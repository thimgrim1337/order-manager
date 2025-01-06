import { relations } from 'drizzle-orm';
import { serial, pgTable, varchar, date } from 'drizzle-orm/pg-core';
import order from './order';

const truck = pgTable('truck', {
  id: serial().primaryKey(),
  plate: varchar({ length: 10 }).unique().notNull(),
  insuranceEndAt: date('insurance_endAt').notNull().defaultNow(),
  serviceEndAt: date('service_endAt').notNull().defaultNow(),
});

export const truckRelations = relations(truck, ({ many }) => ({
  orders: many(order),
}));

export default truck;
