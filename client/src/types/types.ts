import { DriverWithId } from '@/server/src/api/drivers/drivers.model';
import { TruckWithId } from '@/server/src/api/trucks/trucks.model';
import { z } from 'zod';

export const ID = z.object({
  id: z.number(),
});
export type ID = z.infer<typeof ID>;

export const Order = z.object({
  id: z.number().optional(),
  orderNr: z
    .string()
    .min(1, { message: 'Nr zlecenia jest zbyt krótki.' })
    .max(30, { message: 'Nr zlecenia jest zbyt długi.' }),
  startDate: z.string().date(),
  endDate: z.string().date(),
  statusID: z.number().min(1).max(3).default(1),
  priceCurrency: z.string({ message: 'Wprowadź cenę transportu.' }),
  pricePLN: z.string(),
  currency: z.enum(['PLN', 'EUR'], { message: 'Wybierz walutę.' }),
  currencyRate: z.string(),
  truckID: z.number({ message: 'Wybierz pojazd.' }).min(1),
  driverID: z.number({ message: 'Wybierz kierowcę.' }).min(1),
  customerID: z.number({ message: 'Wybierz zleceniodawcę.' }).min(1),
  loadingPlaces: z
    .object({
      id: z.number().optional(),
      name: z.string(),
      postal: z.string(),
      countryID: z.number(),
    })
    .array()
    .min(1, { message: 'Wybierz co najmniej jedno miejsce załadunku.' }),
  unloadingPlaces: z
    .object({
      id: z.number().optional(),
      name: z.string(),
      postal: z.string(),
      countryID: z.number(),
    })
    .array()
    .min(1, { message: 'Wybierz co najmniej jedno miejsce rozładunku.' }),
});
export type Order = z.infer<typeof Order>;
export const OrderWithId = Order.extend({
  id: z.number(),
});
export type OrderWithId = z.infer<typeof OrderWithId>;

export const OrderWithDetails = OrderWithId.extend({
  status: z.object({
    name: z.string().min(1),
  }),
  truck: z.object({
    plate: z.string().min(1),
  }),
  driver: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  customer: z.object({
    name: z.string().min(1),
  }),
});
export type OrderWithDetails = z.infer<typeof OrderWithDetails>;

export const Customer = z.object({
  name: z.string().min(1, { message: 'Wprowadź nazwę zleceniodawcy.' }),
  tax: z
    .string()
    .min(10, { message: 'NIP jest zbyt krótki.' })
    .max(50, { message: 'NIP jest zbyt długi.' }),
});
export type Customer = z.infer<typeof Customer>;
export type CustomerWithId = Customer & ID;

export type Driver = DriverWithId;
export type Truck = TruckWithId;

export const City = z
  .object({
    id: z.number().optional(),
    name: z
      .string()
      .min(1, { message: 'Podaj nazwę miejscowości.' })
      .max(255)
      .regex(
        /[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/,
        'W nazwie miejscowości dostępne są tylko litery.'
      ),

    postal: z
      .string()
      .min(1, { message: 'Podaj kod pocztowy miejscowości.' })
      .max(10, { message: 'Kod pocztowy musi być krótszy niż 10 znaków.' }),
    countryID: z.coerce.number(),
  })
  .strict();
export type City = z.infer<typeof City>;
export type CityWithId = City & ID;
export type CityWithCountry = City & Country;

export type Country = {
  name: string;
  code: string;
};
export type CountryWithId = Country & ID;

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

export type Currencies = 'PLN' | 'EUR';

export type OpenHolidaysResponse = {
  comment: [{ language: string; text: string }];
  endDate: string;
  id: string;
  name: [language: string, text: string];
  nationalwide: boolean;
  regionalScope: string;
  startDate: string;
  subdivisions: [code: string, shortName: string];
  temporalScope: string;
  type: string;
};
