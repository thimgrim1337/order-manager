import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import order from './order';

const customer = pgTable('customer', {
  id: serial().primaryKey(),
  tax: varchar('tax_nr', { length: 15 }).notNull().unique(),
  name: varchar({ length: 50 }).notNull().unique(),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  orders: many(order),
}));

export default customer;
