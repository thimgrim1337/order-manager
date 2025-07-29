import { relations, sql } from 'drizzle-orm';
import { index, pgTable, serial, text } from 'drizzle-orm/pg-core';
import order from './order';

const customer = pgTable(
  'customers',
  {
    id: serial().primaryKey(),
    tax: text('tax_nr').notNull().unique(),
    name: text().notNull().unique(),
  },
  (table) => [
    index('idx_customers_name_lower').using('btree', sql`LOWER(${table.name})`),
  ]
);

export const customerRelations = relations(customer, ({ one, many }) => ({
  orders: many(order),
}));

export default customer;
