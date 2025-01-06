import type db from '../index';
import { loadingPlaces } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(loadingPlaces).values([
    {
      orderID: 1,
      placeID: 3,
    },
  ]);
}
