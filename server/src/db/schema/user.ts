import { pgTable, serial, text } from 'drizzle-orm/pg-core';

const user = pgTable('users', {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
  token: text().unique(),
});

export default user;
