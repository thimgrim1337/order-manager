import { unloadingPlaces } from '@/db/schema/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const unloadingPlace = createInsertSchema(unloadingPlaces);
export type unloadingPlace = z.infer<typeof unloadingPlace>;

export const unloadingPlaceWithId = createSelectSchema(unloadingPlaces);
export type unloadingPlaceWithId = z.infer<typeof unloadingPlaceWithId>;
