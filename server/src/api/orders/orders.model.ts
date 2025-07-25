import { PaginationParams, SortParams } from '@/interfaces/Filters';
import { order } from '../../db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const Places = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    postal: z.string(),
    countryID: z.number(),
  })
  .array()
  .min(1);

export const Order = createInsertSchema(order, {
  orderNr: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  customerID: z.coerce.number().min(1),
  truckID: z.coerce.number().min(1),
  driverID: z.coerce.number().min(1),
  statusID: z.coerce.number().min(1),
  priceCurrency: z.string(),
  pricePLN: z.string().min(1),
  currency: z.enum(['PLN', 'EUR']).default('PLN'),
  currencyRate: z.string().min(1),
});
export type Order = z.infer<typeof Order>;

export const OrderWithId = createSelectSchema(order);
export type OrderWithId = z.infer<typeof OrderWithId>;

export const OrderWithPlaces = Order.extend({
  loadingPlaces: Places,
  unloadingPlaces: Places,
});
export type OrderWithPlaces = z.infer<typeof OrderWithPlaces>;

export const OrderWithIdAndPlaces = OrderWithId.extend({
  loadingPlaces: Places,
  unloadingPlaces: Places,
});
export type OrderWithIdAndPlaces = z.infer<typeof OrderWithIdAndPlaces>;

export const OrderWithIdAndDetails = OrderWithId.extend({
  status: z.string().min(1),
  truck: z.string().min(1),
  driver: z.string().min(1),
  customer: z.string().min(1),
  loadingCity: z.string().min(1),
  unloadingCity: z.string().min(1),
  loadingPlaces: Places,
  unloadingPlaces: Places,
});
export type OrderWithIdAndDetails = z.infer<typeof OrderWithIdAndDetails>;

const OrderSpecifedFilters = Order.partial();

export const OrderFilters =
  OrderSpecifedFilters.merge(PaginationParams).merge(SortParams);
export type OrderFilters = Partial<z.infer<typeof OrderFilters>>;
