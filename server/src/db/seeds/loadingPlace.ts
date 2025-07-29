import { OrderPlace } from '@/api/places/places.model';
import type db from '../index';
import { loadingPlaces } from '../schema/index';
import { faker } from '@faker-js/faker';

export default async function seed(db: db) {
  const rels: OrderPlace[] = [];
  for (let i = 1; i < 1000; i++) {
    rels.push({
      orderID: i,
      placeID: faker.number.int({ min: 1, max: 39 }),
    });
  }

  try {
    await db.insert(loadingPlaces).values(rels);
  } catch (error) {
    console.error(error);
  }
}
