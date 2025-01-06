import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { place } from '../../db/schema/index';
import { z } from 'zod';
import { Address, AddressWithCountry } from '../addresses/addresses.model';

export const Place = createInsertSchema(place, {
  name: z.string().min(2).max(255),
});
export type Place = z.infer<typeof Place>;

export const PlaceWithFullAddress = Place.extend({
  address: Address,
}).omit({ addressID: true });
export type PlaceWithFullAddress = z.infer<typeof PlaceWithFullAddress>;

export const PlaceWithFullAddressWithCountry = Place.extend({
  address: AddressWithCountry,
});
export type PlaceWithFullAddressWithCountry = z.infer<
  typeof PlaceWithFullAddressWithCountry
>;

export const PlaceWithId = createSelectSchema(place);
export type PlaceWithId = z.infer<typeof PlaceWithId>;

export const PlaceWithIdWithFullAddress = PlaceWithId.extend({
  address: AddressWithCountry,
}).omit({
  addressID: true,
});
export type PlaceWithIdWithFullAddress = z.infer<
  typeof PlaceWithIdWithFullAddress
>;
