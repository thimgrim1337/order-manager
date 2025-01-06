import type db from '../index';
import { unloadingPlaces } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(unloadingPlaces).values([
    {
      orderID: 1,
      placeID: 1,
    },
    {
      orderID: 1,
      placeID: 2,
    },
  ]);
}
