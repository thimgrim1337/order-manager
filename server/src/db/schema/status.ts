import { sql } from 'drizzle-orm';
import { serial, pgTable, text, index } from 'drizzle-orm/pg-core';

const status = pgTable(
  'statuses',
  {
    id: serial().primaryKey(),
    name: text().unique().notNull(),
  },
  (table) => [
    index('idx_statuses_name_lower').using('btree', sql`LOWER(${table.name})`),
  ]
);

export default status;
