import { z, string } from 'zod';

export const ParamsWithId = z.object({
  id: string().min(1),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
