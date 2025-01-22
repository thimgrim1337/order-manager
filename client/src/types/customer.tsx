import { z } from 'zod';

export const Customer = z.object({
  name: z.string().min(1),
});
export type Customer = z.infer<typeof Customer>;
