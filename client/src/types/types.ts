import { isAfter } from 'date-fns';
import { z } from 'zod/v4';

type WithId<T> = T & { id: number };

export const City = z.object({
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
});
export type City = z.infer<typeof City>;
export type CityWithId = WithId<City>;

export type CityWithCountry = City & { country: Country };

export const Country = z.object({
  name: z.string(),
  code: z.string(),
});
export type Country = z.infer<typeof Country>;
export type CountryWithId = WithId<Country>;

export const Order = z
  .object({
    orderNr: z
      .string()
      .min(1, { message: 'Nr zlecenia jest zbyt krótki.' })
      .max(30, { message: 'Nr zlecenia jest zbyt długi.' }),
    startDate: z.string(),
    endDate: z.string(),
    statusID: z.number().min(1).max(3).default(1),
    priceCurrency: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(Number(val)), {
        message: 'Wartość musi być liczbą.',
      })
      .refine((val) => val > 0, { message: 'Cena musi być większa od 0.' })
      .transform((val) => String(val)),
    pricePLN: z.string(),
    currency: z.enum(['PLN', 'EUR'], { message: 'Wybierz walutę.' }),
    currencyRate: z.string(),
    truckID: z.number({ message: 'Wybierz pojazd.' }).min(1),
    driverID: z.number({ message: 'Wybierz kierowcę.' }).min(1),
    customerID: z.number({ message: 'Wybierz zleceniodawcę.' }).min(1),
    loadingPlaces: City.array().min(1, {
      message: 'Wybierz co najmniej jedno miejsce załadunku.',
    }),
    unloadingPlaces: City.array().min(1, {
      message: 'Wybierz co najmniej jedno miejsce rozładunku.',
    }),
  })
  .refine((data) => isAfter(data.endDate, data.startDate), {
    message: 'Data załadunku nie może być późniejsza niż data rozładunku.',
    path: ['startDate'],
  });
export type Order = z.infer<typeof Order>;
export const OrderWithId = Order.extend({ id: z.number() });
export type OrderWithId = z.infer<typeof OrderWithId>;

export const OrderStatus = z.object({
  name: z.enum(['W trakcie', 'Anulowane', 'Zakończone']),
});
export type OrderStatus = z.infer<typeof OrderStatus>;
export type OrderStatusWithId = WithId<OrderStatus>;

export const Truck = z.object({
  plate: z.string().min(4).max(8),
  insuranceEndAt: z.string().date(),
  serviceEndAt: z.string().date(),
});
export type Truck = z.infer<typeof Truck>;
export type TruckWithId = WithId<Truck>;

export const Driver = z.object({
  firstName: z.string().max(20).min(2),
  lastName: z.string().max(20).min(2),
});
export type Driver = z.infer<typeof Driver>;
export type DriverWithId = WithId<Driver>;

export const Customer = z.object({
  name: z.string().min(1, { message: 'Wprowadź nazwę zleceniodawcy.' }),
  tax: z
    .string()
    .min(1, { message: 'Wprowadź NIP.' })
    .min(10, { message: 'NIP jest zbyt krótki.' })
    .max(50, { message: 'NIP jest zbyt długi.' }),
});
export type Customer = z.infer<typeof Customer>;
export type CustomerWithId = WithId<Customer>;

export const OrderDetails = z.object({
  status: OrderStatus,
  truck: Truck,
  driver: Driver,
  customer: Customer,
});
export type OrderDetails = z.infer<typeof OrderDetails>;
export type OrderWithDetails = OrderWithId & OrderDetails;

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

export type ApiError = {
  message: string;
  statusCode: number | string;
};
