import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { customer } from '../../db/schema/index';

export const Customer = createInsertSchema(customer, {
  name: z.string().min(2).max(50),
  tax: z.string().min(10).max(18),
});
export type Customer = z.infer<typeof Customer>;

export const CustomerWithId = createSelectSchema(customer);
export type CustomerWithId = z.infer<typeof CustomerWithId>;
