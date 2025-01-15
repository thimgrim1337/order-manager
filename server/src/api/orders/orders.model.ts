import { order } from '../../db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const Order = createInsertSchema(order, {
  orderNr: z.string().min(1).max(30),
  startDate: z.string().date(),
  endDate: z.string().date(),
  statusID: z.number().min(1),
  priceCurrency: z.string(),
  pricePLN: z.string(),
  currency: z.string(),
  currencyRate: z.string(),
  truckID: z.number().min(1),
  driverID: z.number().min(1),
  customerID: z.number().min(1),
}).extend({
  loadingPlaces: z.number().array(),
  unloadingPlaces: z.number().array(),
});
export type Order = z.infer<typeof Order>;

export const OrderWithId = createSelectSchema(order);
export type OrderWithId = z.infer<typeof OrderWithId>;

export const OrderWithIdAndDetails = OrderWithId.extend({
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
export type OrderWithIdAndDetails = z.infer<typeof OrderWithIdAndDetails>;
