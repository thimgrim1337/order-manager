import { z } from 'zod';

export const Order = z.object({
  orderNr: z.string().min(1).max(30),
  startDate: z.string().date(),
  endDate: z.string().date(),
  status: z.object({
    name: z.enum(['W trakcie', 'Anulowane', 'Zakończone']),
  }),
  pricePLN: z.string(),
  priceCurrency: z.string(),
  currency: z.string().min(1).max(3).default('PLN'),
  currencyRate: z.string(),
  truck: z.number(),
  driver: z.number(),
  customer: z.number(),
  orderLoadingPlaces: z
    .object({
      placeID: z.number(),
      place: z.object({
        name: z.string().min(1),
      }),
    })
    .array(),
  orderUnloadingPlaces: z
    .object({
      placeID: z.number(),
      place: z.object({
        name: z.string().min(1),
      }),
    })
    .array(),
});

export type Order = z.infer<typeof Order>;
