import type db from '../index';
import customers from './data/customers.json';
import { customer } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(customer).values(customers);
}
