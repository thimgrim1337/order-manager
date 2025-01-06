import { order } from '../../db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const Order = createInsertSchema(order, {
  orderNr: z.string().min(1).max(30),
  startTime: z.string().date(),
  endTime: z.string().date(),
  statusID: z.number().min(1),
  price: z.string(),
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
