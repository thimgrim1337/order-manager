import { eq } from 'drizzle-orm';
import db from '../../db/index';
import { place } from '../../db/schema/index';
import { Place } from './places.model';

export const placesServices = {
  getPlacesQuery: () =>
    db.query.place.findMany({
      columns: {
        addressID: false,
      },
      with: {
        address: {
          columns: {
            id: false,
            countryID: false,
          },
          with: {
            country: {
              columns: {
                id: false,
              },
            },
          },
        },
      },
    }),
  getPlaceByIdQuery: (placeID: number) =>
    db.query.place.findFirst({
      where: (place) => eq(place.id, placeID),
      with: {
        address: {
          columns: {
            id: false,
            countryID: false,
          },
          with: {
            country: {
              columns: {
                id: false,
              },
            },
          },
        },
      },
    }),
  getPlaceByNameQuery: (placeName: string) =>
    db.query.place.findFirst({
      where: (place) => eq(place.name, placeName),
    }),
  addPlaceQuery: (newPlace: Place) =>
    db.insert(place).values(newPlace).returning(),
  deletePlaceQuery: (placeID: number) =>
    db.delete(place).where(eq(place.id, placeID)).returning(),
  updatePlaceQuery: (placeID: number, placeToUpdate: Place) =>
    db
      .update(place)
      .set(placeToUpdate)
      .where(eq(place.id, placeID))
      .returning(),
};
