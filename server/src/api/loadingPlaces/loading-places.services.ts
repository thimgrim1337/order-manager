import db from '@/db';
import { loadingPlaces } from '@/db/schema/index';
import { loadingPlace, loadingPlaceWithId } from './loading-places.model';
import { eq } from 'drizzle-orm';

export const loadingPlacesService = {
  getAllLoadingPlacesByOrderIdQuery: (orderID: number) =>
    db.query.loadingPlaces.findMany({
      where: (loadingPlace) => eq(loadingPlace.orderID, orderID),
    }),
  addLoadingPlaceQuery: (newLoadingPlace: loadingPlace[]) =>
    db.insert(loadingPlaces).values(newLoadingPlace).returning(),
  updateLoadingPlacesQuery: (newLoadingPlaces: loadingPlaceWithId[]) =>
    db.transaction(async (tx) => {
      for (const place of newLoadingPlaces) {
        await tx
          .update(loadingPlaces)
          .set({
            placeID: place.placeID,
            orderID: place.orderID,
          })
          .where(eq(loadingPlaces.id, place.id));
      }
    }),
  deleteLoadingPlacesQuery: (placesToRemove: loadingPlaceWithId[]) =>
    db.transaction(async (tx) => {
      for (const place of placesToRemove) {
        await tx.delete(loadingPlaces).where(eq(loadingPlaces.id, place.id));
      }
    }),
  deleteLoadingPlacesByOrderIdQuery: (orderID: number) =>
    db
      .delete(loadingPlaces)
      .where(eq(loadingPlaces.orderID, orderID))
      .returning(),
};
