import { relations } from 'drizzle-orm';
import { serial, pgTable, varchar, unique } from 'drizzle-orm/pg-core';
import order from './order';

const driver = pgTable(
  'driver',
  {
    id: serial().primaryKey(),
    firstName: varchar('first_name', { length: 20 }).notNull(),
    lastName: varchar('last_name', { length: 20 }).notNull(),
  },
  (table) => ({
    pk: unique('full_name').on(table.firstName, table.lastName),
  })
);

export const driverRelations = relations(driver, ({ many }) => ({
  orders: many(order),
}));

export default driver;
