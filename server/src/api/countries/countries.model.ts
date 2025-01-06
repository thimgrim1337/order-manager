import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { country } from '@/db/schema/index';
import { string, z } from 'zod';

export const Country = createInsertSchema(country, {
  name: string().min(3),
  code: string().min(2),
});
export type Country = z.infer<typeof Country>;

export const CountryWithId = createSelectSchema(country);
export type CountryWithId = z.infer<typeof CountryWithId>;
