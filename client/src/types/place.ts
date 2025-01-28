import { z } from 'zod';

export const Place = z.object({
  id: z.number(),
  name: z.string().min(1),
});
export type Place = z.infer<typeof Place>;
