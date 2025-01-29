import { z } from 'zod';

export const Truck = z.object({
  id: z.number(),
  plate: z.string().min(1),
});
export type Truck = z.infer<typeof Truck>;
