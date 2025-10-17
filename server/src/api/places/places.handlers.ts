import { AppError } from '@/lib/app-error';
import { placesServices } from './places.services';
import { PlaceType } from './places.model';
import { dbTransaction } from '@/db';

export const addPlaces = async (
  orderID: number,
  places: number[],
  placeType: PlaceType,
  trx: dbTransaction
) => {
  try {
    const newPlaces = places.map((placeID) => ({
      orderID,
      placeID,
    }));

    await placesServices.addOrderPlacesQuery(newPlaces, placeType, trx);
  } catch (error) {
    throw new AppError(`Failed to create ${placeType}.`, 500);
  }
};

export const removePlaces = async (
  orderID: number,
  placeType: PlaceType,
  trx: dbTransaction
) => {
  try {
    await placesServices.removeOrderPlacesQuery(orderID, placeType, trx);
  } catch (error) {
    throw new AppError(`Failed to remove ${placeType}.`, 500);
  }
};

export const updatePlaces = async (
  orderID: number,
  placeType: PlaceType,
  places: number[],
  trx: dbTransaction
) => {
  try {
    if (!places.length) return;

    const newPlaces = places.map((placeID) => ({
      orderID,
      placeID,
    }));

    await placesServices.updateOrderPlacesQuery(
      orderID,
      placeType,
      newPlaces,
      trx
    );
  } catch (error) {}
};
