import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { driver } from '../../db/schema/index';

export const Driver = createInsertSchema(driver, {
  firstName: z.string().max(20).min(2),
  lastName: z.string().max(20).min(2),
});
export type Driver = z.infer<typeof Driver>;

export const DriverWithId = createSelectSchema(driver);
export type DriverWithId = z.infer<typeof DriverWithId>;
