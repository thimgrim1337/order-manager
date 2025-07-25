import { dbTransaction } from '@/db';
import { loadingPlaces, unloadingPlaces } from '@/db/schema';

import { OrderPlace, PlaceType } from './places.model';
import { eq } from 'drizzle-orm';

export const placesServices = {
  addOrderPlacesQuery: async (
    orderPlaces: OrderPlace[],
    placeType: PlaceType,
    trx: dbTransaction
  ) => {
    if (!orderPlaces.length) return;
    const table =
      placeType === 'loadingPlace' ? loadingPlaces : unloadingPlaces;
    const result = await trx.insert(table).values(orderPlaces);

    return result;
  },

  removeOrderPlacesQuery: async (
    orderID: number,
    placeType: PlaceType,
    trx: dbTransaction
  ) => {
    const table =
      placeType === 'loadingPlace' ? loadingPlaces : unloadingPlaces;
    const result = await trx
      .delete(table)
      .where(eq(table.orderID, orderID))
      .returning();

    return result;
  },

  updateOrderPlacesQuery: async (
    orderID: number,
    placeType: PlaceType,
    orderPlaces: OrderPlace[],
    trx: dbTransaction
  ) => {
    const removedPlaces = await placesServices.removeOrderPlacesQuery(
      orderID,
      placeType,
      trx
    );

    if (!removedPlaces.length)
      throw new Error('Failed to remove orders places.');

    const updatedPlaces = await placesServices.addOrderPlacesQuery(
      orderPlaces,
      placeType,
      trx
    );

    if (!updatedPlaces) throw new Error('Failed to add updated orders places.');

    return unloadingPlaces;
  },
};
