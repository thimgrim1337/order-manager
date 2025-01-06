import { loadingPlaces } from '@/db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const loadingPlace = createInsertSchema(loadingPlaces);
export type loadingPlace = z.infer<typeof loadingPlace>;

export const loadingPlaceWithId = createSelectSchema(loadingPlaces);
export type loadingPlaceWithId = z.infer<typeof loadingPlaceWithId>;
