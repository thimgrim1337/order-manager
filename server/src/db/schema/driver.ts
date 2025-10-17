import { relations } from 'drizzle-orm';
import {
  serial,
  pgTable,
  text,
  integer,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import order from './order';
import truck from './truck';

export const driver = pgTable('drivers', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  truckID: integer('truck_id').references((): AnyPgColumn => driver.id),
});

export const driverRelations = relations(driver, ({ one, many }) => ({
  orders: many(order),
  truck: one(truck, {
    fields: [driver.truckID],
    references: [truck.id],
  }),
}));

export default driver;
