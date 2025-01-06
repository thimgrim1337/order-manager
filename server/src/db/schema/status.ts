import { serial, pgTable, varchar } from 'drizzle-orm/pg-core';

const status = pgTable('status', {
  id: serial().primaryKey(),
  name: varchar({ length: 20 }).unique().notNull(),
});

export default status;
