import type db from '../index';
import orders from './data/orders.json';
import { order } from '../schema/index';
import { Order } from '@/api/orders/orders.model';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { appendData } from '@/lib/file';
import { join } from 'path';
import { __dirname } from '@/server';

const formatDate = (
  date: Date | number | undefined,
  dateFormat: string = 'yyyy-MM-dd'
) => {
  if (!date) return '';

  return format(date, dateFormat, { locale: pl });
};

function createFakeOrder(): Order {
  const currency = faker.helpers.arrayElement(['EUR', 'PLN']);
  const currencyRate = String(
    currency === 'EUR'
      ? faker.finance.amount({ min: 4.15, max: 4.35, dec: 4 })
      : 1
  );
  const priceCurrency = faker.finance.amount({ min: 100, dec: 2 });
  const pricePLN = Number(+priceCurrency * +currencyRate).toFixed(2);

  return {
    orderNr: faker.string.numeric({ length: 10 }),
    customerID: faker.number.int({ min: 1, max: 4 }),
    driverID: faker.number.int({ min: 1, max: 14 }),
    truckID: faker.number.int({ min: 1, max: 14 }),
    statusID: faker.number.int({ min: 1, max: 3 }),
    pricePLN: pricePLN,
    currency: currency,
    currencyRate: currencyRate,
    priceCurrency: priceCurrency,
    startDate: formatDate(faker.date.recent({ days: 7 })),
    endDate: formatDate(faker.date.recent({ days: 7 })),
  };
}

export default async function seed(db: db) {
  try {
    const orders = [];
    for (let i = 0; i < 999; i++) {
      orders.push(createFakeOrder());
    }

    await appendData(join(__dirname, 'data/orders.json'), orders);

    await db.insert(order).values(orders);
  } catch (error) {
    console.error(error);
  }
}
