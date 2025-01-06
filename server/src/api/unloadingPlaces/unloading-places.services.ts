import db from '@/db';
import { unloadingPlaces } from '@/db/schema/index';
import { unloadingPlace, unloadingPlaceWithId } from './unloading-places.model';
import { eq } from 'drizzle-orm';

export const unloadingPlacesService = {
  getAllUnloadingPlacesByOrderIdQuery: (orderID: number) =>
    db.query.unloadingPlaces.findMany({
      where: (unloadingPlace) => eq(unloadingPlace.orderID, orderID),
    }),
  addUnloadingPlaceQuery: (newUnloadingPlace: unloadingPlace[]) =>
    db.insert(unloadingPlaces).values(newUnloadingPlace).returning(),
  updateUnloadingPlacesQuery: (newUnloadingPlaces: unloadingPlaceWithId[]) =>
    db.transaction(async (tx) => {
      for (const place of newUnloadingPlaces) {
        await tx
          .update(unloadingPlaces)
          .set({
            placeID: place.placeID,
            orderID: place.orderID,
          })
          .where(eq(unloadingPlaces.id, place.id));
      }
    }),
  deleteUnloadingPlacesQuery: (placesToRemove: unloadingPlaceWithId[]) =>
    db.transaction(async (tx) => {
      for (const place of placesToRemove) {
        await tx
          .delete(unloadingPlaces)
          .where(eq(unloadingPlaces.id, place.id));
      }
    }),
  deleteUnloadingPlacesByOrderIdQuery: (orderID: number) =>
    db
      .delete(unloadingPlaces)
      .where(eq(unloadingPlaces.orderID, orderID))
      .returning(),
};
