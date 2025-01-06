import type db from '../index';
import addresses from './data/addresses.json';
import { address } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(address).values(addresses);
}
