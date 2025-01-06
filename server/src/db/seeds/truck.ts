import type db from '../index';
import trucks from './data/trucks.json';
import { truck } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(truck).values(trucks);
}
