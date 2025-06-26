import { z } from 'zod';

export const QueryParams = z.object({
  truckId: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().default('1'),
  pageSize: z.string().default('10'),
});
export type QueryParams = z.infer<typeof QueryParams>;
