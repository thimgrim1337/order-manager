import { z } from 'zod';

export const Driver = z.object({
  id: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
export type Driver = z.infer<typeof Driver>;
