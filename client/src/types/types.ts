import { OrderWithIdAndDetails } from '@/server/src/api/orders/orders.model';
import { CustomerWithFullAddressWithCountry } from '@/server/src/api/customers/customers.model';
import { DriverWithId } from '@/server/src/api/drivers/drivers.model';
import { CityWithId } from '@/server/src/api/cities/cities.model';
import { TruckWithId } from '@/server/src/api/trucks/trucks.model';

import { z } from 'zod';

export type Order = OrderWithIdAndDetails;
export const OrderCreateSchema = z.object({
  orderNr: z
    .string()
    .min(1, { message: 'Nr zlecenia jest zbyt krótki.' })
    .max(30, { message: 'Nr zlecenia jest zbyt długi.' }),
  startDate: z.string().date(),
  endDate: z.string().date(),
  statusID: z.number().min(1).max(3).default(1),
  priceCurrency: z.string({ message: 'Wprowadź cenę transportu.' }),
  pricePLN: z.string(),
  currency: z.string({ message: 'Wybierz walutę.' }),
  currencyRate: z.string(),
  truckID: z.number({ message: 'Wybierz pojazd.' }).min(1),
  driverID: z.number({ message: 'Wybierz kierowcę.' }).min(1),
  customerID: z.number({ message: 'Wybierz zleceniodawcę.' }).min(1),
  loadingPlaces: z
    .number()
    .array()
    .min(1, { message: 'Wybierz co najmniej jedno miejsce załadunku.' }),
  unloadingPlaces: z
    .number()
    .array()
    .min(1, { message: 'Wybierz co najmniej jedno miejsce rozładunku.' }),
});
export type OrderCreate = z.infer<typeof OrderCreateSchema>;

export type Customer = CustomerWithFullAddressWithCountry;
export type Driver = DriverWithId;
export type City = CityWithId;
export type Truck = TruckWithId;

export type CurrencyRate = {
  table: string;
  currency: string;
  code: string;
  rates: [
    {
      no: string;
      effectiveDate: string;
      mid: number;
    },
  ];
};
