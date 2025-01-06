import type db from '../index';
import statusData from './data/status.json';
import { status } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(status).values(statusData);
}
