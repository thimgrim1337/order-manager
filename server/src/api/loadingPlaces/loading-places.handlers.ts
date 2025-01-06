import { loadingPlace, loadingPlaceWithId } from './loading-places.model';
import { loadingPlacesService } from './loading-places.services';
import { AppError } from '@/lib/app-error';

export const getAllLoadingPlacesByOrderId = async (orderID: number) => {
  try {
    const loadingPlaces =
      await loadingPlacesService.getAllLoadingPlacesByOrderIdQuery(orderID);

    return loadingPlaces;
  } catch (error) {
    throw new AppError('Failed to fetch loading places.', 500);
  }
};

export const addLoadingPlaces = async (
  orderID: number,
  loadingPlaces: number[]
) => {
  try {
    const newLoadingPlaces = loadingPlaces.map((placeID) => {
      return { orderID, placeID };
    });

    const createdLoadingPlaces =
      await loadingPlacesService.addLoadingPlaceQuery(newLoadingPlaces);

    return createdLoadingPlaces;
  } catch (error) {
    throw new AppError('Failed to create loading places.', 500);
  }
};

export const updateLoadingPlaces = async (
  orderID: number,
  newLoadingPlaces: number[]
) => {
  try {
    const existingPlaces =
      await loadingPlacesService.getAllLoadingPlacesByOrderIdQuery(orderID);

    const existingPlacesIds = existingPlaces.map((place) => place.placeID);
    const newPlaces = newLoadingPlaces.filter(
      (place) => !existingPlacesIds.includes(place)
    );
    const placesToRemove = existingPlacesIds.filter(
      (place) => !newLoadingPlaces.includes(place)
    );

    const updatedRows: loadingPlaceWithId[] = [];
    const addedRows: loadingPlace[] = [];
    const removedRows: loadingPlaceWithId[] = [];

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
      await loadingPlacesService.updateLoadingPlacesQuery(updatedRows);
    if (addedRows.length)
      await loadingPlacesService.addLoadingPlaceQuery(addedRows);
    if (removedRows.length)
      await loadingPlacesService.deleteLoadingPlacesQuery(removedRows);
  } catch (error) {
    throw new AppError('Failed to update loading places.', 500);
  }
};

export const deleteLoadingPlaces = async (orderID: number) => {
  try {
    const deletedLoadingPlaces =
      await loadingPlacesService.deleteLoadingPlacesByOrderIdQuery(orderID);

    return deletedLoadingPlaces;
  } catch (error) {
    throw new AppError('Failed to delete loading places.', 500);
  }
};
