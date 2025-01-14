import { z } from 'zod';

export const Order = z.object({
  orderNr: z.string().min(1).max(30),
  startDate: z.string().date(),
  endDate: z.string().date(),
  status: z.object({
    name: z.string().min(1),
  }),
  price: z.string(),
  currency: z.string().min(1).max(3).default('PLN'),
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
