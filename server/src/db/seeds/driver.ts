import type db from '../index';
import drivers from './data/drivers.json';
import { driver } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(driver).values(drivers);
}
