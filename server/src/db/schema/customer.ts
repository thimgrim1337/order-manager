import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import order from './order';
import address from './address';

const customer = pgTable('customer', {
  id: serial().primaryKey(),
  tax: varchar('tax_nr', { length: 15 }).notNull().unique(),
  name: varchar({ length: 50 }).notNull().unique(),
  addressID: integer('address_id')
    .notNull()
    .references(() => address.id),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  address: one(address, {
    fields: [customer.addressID],
    references: [address.id],
  }),
  orders: many(order),
}));

export default customer;
