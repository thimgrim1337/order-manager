import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { truck } from '../../db/schema/index';
import { z } from 'zod';

export const Truck = createInsertSchema(truck, {
  plate: z.string().min(4).max(8),
  insuranceEndAt: z.string().date(),
  serviceEndAt: z.string().date(),
});
export const TruckWithId = createSelectSchema(truck);
export type Truck = z.infer<typeof Truck>;
export type TruckWithId = z.infer<typeof TruckWithId>;
