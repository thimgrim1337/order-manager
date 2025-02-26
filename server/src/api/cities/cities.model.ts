import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { city } from '../../db/schema/index';
import { z } from 'zod';

export const City = createInsertSchema(city, {
  name: z.string().min(2).max(255),
  postal: z.string().min(1).max(10),
  countryID: z.number().min(1),
});
export type City = z.infer<typeof City>;

export const CityWithId = createSelectSchema(city);
export type CityWithId = z.infer<typeof CityWithId>;

export type CityWithIdAndCountry = z.infer<
  typeof CityWithId & {
    country: {
      name: string;
      code: string;
    };
  }
>;
