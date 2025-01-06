import type db from '../index';
import countries from './data/countries.json';
import { country } from '../schema/index';

export default async function seed(db: db) {
  await db.insert(country).values(countries);
}
