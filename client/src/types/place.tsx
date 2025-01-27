import { z } from 'zod';

export const Place = z.object({
  name: z.string().min(1),
});
export type Place = z.infer<typeof Place>;
