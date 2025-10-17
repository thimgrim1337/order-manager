import type db from '../index';
import cities from './data/cities.json';
import { city } from '../schema/index';
import { City } from '@/api/cities/cities.model';
import { faker } from '@faker-js/faker';
import { appendData } from '@/lib/file';
import { join } from 'path';
import { __dirname } from '@/server';

function createFakeCity(): City {
  return {
    name: faker.location.city(),
    postal: faker.location.zipCode(),
    countryID: faker.number.int({ min: 1, max: 48 }),
  };
}

export default async function seed(db: db) {
  try {
    const cities = [];
    for (let i = 0; i < 40; i++) {
      cities.push(createFakeCity());
    }

    await appendData(join(__dirname, 'data/cities.json'), cities);
    await db.insert(city).values(cities);
  } catch (error) {}
}
