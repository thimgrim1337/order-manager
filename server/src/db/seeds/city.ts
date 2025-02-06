import type db from '../index';
import cities from './data/cities.json';
import { city } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(city).values(cities);
}
