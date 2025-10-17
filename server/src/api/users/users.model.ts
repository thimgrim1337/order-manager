import { user } from '@/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const User = createInsertSchema(user);
export type User = z.infer<typeof User>;

export const UserWithId = createSelectSchema(user);
export type UserWithId = z.infer<typeof UserWithId>;
