import { unloadingPlace, unloadingPlaceWithId } from './unloading-places.model';
import { unloadingPlacesService } from './unloading-places.services';
import { AppError } from '@/lib/app-error';

export const getAllUnloadingPlacesByOrderId = async (orderID: number) => {
  try {
    const unloadingPlaces =
      await unloadingPlacesService.getAllUnloadingPlacesByOrderIdQuery(orderID);

    return unloadingPlaces;
  } catch (error) {
    throw new AppError('Failed to fetch unloading places.', 500);
  }
};

export const addUnloadingPlaces = async (
  orderID: number,
  unloadingPlaces: number[]
) => {
  try {
    const newUnloadingPlaces = unloadingPlaces.map((placeID) => {
      return { orderID, placeID };
    });

    const createdUnloadingPlaces =
      await unloadingPlacesService.addUnloadingPlaceQuery(newUnloadingPlaces);

    return createdUnloadingPlaces;
  } catch (error) {
    throw new AppError('Failed to create unloading places.', 500);
  }
};

export const updateUnloadingPlaces = async (
  orderID: number,
  newUnloadingPlaces: number[]
) => {
  try {
    const existingPlaces =
      await unloadingPlacesService.getAllUnloadingPlacesByOrderIdQuery(orderID);

    const existingPlacesIds = existingPlaces.map((place) => place.placeID);
    const newPlaces = newUnloadingPlaces.filter(
      (place) => !existingPlacesIds.includes(place)
    );
    const placesToRemove = existingPlacesIds.filter(
      (place) => !newUnloadingPlaces.includes(place)
    );

    const updatedRows: unloadingPlaceWithId[] = [];
    const addedRows: unloadingPlace[] = [];
    const removedRows: unloadingPlaceWithId[] = [];

    if (newPlaces.length >= placesToRemove.length) {
      newPlaces.forEach((place, index) => {
        if (index < placesToRemove.length) {
          const row = existingPlaces.find(
            (r) => r.placeID === placesToRemove[index]
          );

          if (!row) return;

          row.placeID = place;
          return updatedRows.push(row);
        }

        return addedRows.push({
          orderID,
          placeID: place,
        });
      });
    } else {
      placesToRemove.forEach((place, index) => {
        if (index < newPlaces.length) {
          const row = existingPlaces.find(
            (r) => r.placeID === newPlaces[index]
          );

          if (!row) return;

          row.placeID = place;
          return updatedRows.push(row);
        }

        const row = existingPlaces.find(
          (r) => r.placeID === placesToRemove[index]
        );
        if (!row) return;

        return removedRows.push(row);
      });
    }

    if (updatedRows.length)
      await unloadingPlacesService.updateUnloadingPlacesQuery(updatedRows);
    if (addedRows.length)
      await unloadingPlacesService.addUnloadingPlaceQuery(addedRows);
    if (removedRows.length)
      await unloadingPlacesService.deleteUnloadingPlacesQuery(removedRows);
  } catch (error) {
    throw new AppError('Failed to update unloading places.', 500);
  }
};

export const deleteUnloadingPlaces = async (orderID: number) => {
  try {
    const deletedUnloadingPlaces =
      await unloadingPlacesService.deleteUnloadingPlacesByOrderIdQuery(orderID);

    return deletedUnloadingPlaces;
  } catch (error) {
    throw new AppError('Failed to delete unloading places.', 500);
  }
};
