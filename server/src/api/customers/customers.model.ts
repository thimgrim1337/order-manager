import { z } from 'zod';
import { Address, AddressWithCountry } from '../addresses/addresses.model';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { customer } from '../../db/schema/index';

export const Customer = createInsertSchema(customer, {
  name: z.string().min(2).max(50),
  tax: z.string().min(10).max(18),
  addressID: z.number().min(1),
});
export type Customer = z.infer<typeof Customer>;

export const CustomerWithFullAddress = Customer.extend({
  address: Address,
}).omit({ addressID: true });
export type CustomerWithFullAddress = z.infer<typeof CustomerWithFullAddress>;

export const CustomerWithFullAddressWithCountry =
  CustomerWithFullAddress.extend({
    address: AddressWithCountry,
  });
export type CustomerWithFullAddressWithCountry = z.infer<
  typeof CustomerWithFullAddressWithCountry
>;

export const CustomerWithId = createSelectSchema(customer);
export type CustomerWithId = z.infer<typeof CustomerWithId>;

export const CustomerWithIdWithFullAddress = CustomerWithId.extend({
  address: AddressWithCountry,
}).omit({
  addressID: true,
});
export type CustomerWithIdWithFullAddress = z.infer<
  typeof CustomerWithIdWithFullAddress
>;
