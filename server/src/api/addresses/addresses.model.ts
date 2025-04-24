import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { number, string, z } from 'zod';
import { address } from '../../db/schema/index';
import { Country } from '../countries/countries.model';

export const Address = createInsertSchema(address, {
  street: string().min(3),
  streetNr: string().min(1),
  postal: string().min(1),
  city: string().min(3),
  countryID: number().min(1),
});
export type Address = z.infer<typeof Address>;

export const AddressWithId = createSelectSchema(address);
export type AddressWithId = z.infer<typeof AddressWithId>;

export const AddressWithCountry = createSelectSchema(address, {
  id: (schema) => schema.id.optional(),
});
export type AddressWithCountry = z.infer<typeof AddressWithCountry> & {
  country: Country;
};
