import { and, eq } from 'drizzle-orm';
import db from '@/db/index';
import { Address } from './addresses.model';
import { address } from '@/db/schema/index';

export const addressServices = {
  getAddressesQuery: () => db.query.address.findMany(),

  getAddressByIdQuery: (addressId: number) =>
    db.query.address.findFirst({
      where: (address) => eq(address.id, addressId),
    }),

  getAddressByStreetQuery: (addressQuery: Address) =>
    db.query.address.findFirst({
      where: (address) =>
        and(
          eq(address.street, addressQuery.street),
          eq(address.streetNr, addressQuery.streetNr),
          eq(address.city, addressQuery.city),
          eq(address.countryID, addressQuery.countryID)
        ),
    }),

  createAddressQuery: (newAddress: Address) =>
    db.insert(address).values(newAddress).returning(),

  deleteAddressQuery: (addressId: number) =>
    db.delete(address).where(eq(address.id, addressId)),

  updateAddressQuery: (addressId: number, addressToUpdate: Address) =>
    db
      .update(address)
      .set(addressToUpdate)
      .where(eq(address.id, addressId))
      .returning(),
};
