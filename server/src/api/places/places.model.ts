import { loadingPlaces, unloadingPlaces } from '@/db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const loadingPlace = createInsertSchema(loadingPlaces);
export const unloadingPlace = createInsertSchema(unloadingPlaces);
export type OrderPlace = z.infer<typeof loadingPlace>;

export type PlaceType = 'loadingPlace' | 'unloadingPlace';
