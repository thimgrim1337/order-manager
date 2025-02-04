import { z } from 'zod';

export const InsertOrder = z.object({
  orderNr: z
    .string()
    .min(1, 'Wprowadź nr zlecenia. > 1')
    .max(30, 'Nr zlecenia jest za długi. < 30'),
  startDate: z.string().date(),
  endDate: z.string().date(),
  statusID: z.number().min(1).max(3).default(0),
  pricePLN: z.string(),
  priceCurrency: z.string(),
  currency: z.enum(['EUR', 'PLN']).default('PLN'),
  currencyRate: z.string(),
  truckID: z.number({ message: 'Pojazd jest wymagany.' }),
  driverID: z.number({ message: 'Kierowca jest wymagany.' }),
  customerID: z.number({ message: 'Zleceniodawca jest wymagany.' }),
  loadingPlaces: z
    .number()
    .array()
    .min(1, 'Musisz wybrać cojanmniej 1 miejsce załadunku.'),
  unloadingPlaces: z
    .number()
    .array()
    .min(1, 'Musisz wybrać conajmniej 1 miejsce rozładunku.'),
});
export type InsertOrder = z.infer<typeof InsertOrder>;

export const Order = z.object({
  orderNr: z.string(),
  startDate: z.string().date(),
  endDate: z.string().date(),
  statusID: z.enum(['W trakcie', 'Anulowane', 'Zakończone']),
  pricePLN: z.string(),
  priceCurrency: z.string(),
  currency: z.enum(['EUR', 'PLN']).default('PLN'),
  currencyRate: z.string(),
  truck: z.object({
    palate: z.string(),
  }),
  driver: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  customer: z.object({
    name: z.string(),
  }),
  loadingPlaces: z
    .object({
      place: z.object({
        name: z.string(),
      }),
    })
    .array(),
  unloadingPlaces: z
    .object({
      place: z.object({
        name: z.string(),
      }),
    })
    .array(),
});
export type Order = z.infer<typeof Order>;
