import type db from '../index';
import orders from './data/orders.json';
import { order } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(order).values(orders);
}
