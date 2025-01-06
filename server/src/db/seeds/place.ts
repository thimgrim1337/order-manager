import type db from '../index';
import places from './data/places.json';
import { place } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(place).values(places);
}
