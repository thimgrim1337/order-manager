import { eq } from 'drizzle-orm';
import db, { dbTransaction } from '../../db/index';
import truck from '../../db/schema/truck';
import { Truck } from './trucks.model';

export const truckServices = {
  getTrucksQuery: () =>
    db.query.truck.findMany({
      orderBy: (truck) => truck.id,
    }),

  getTruckByIdQuery: (truckId: number, trx?: dbTransaction) => {
    if (!truckId || truckId < 1)
      throw new Error('TruckID must be provided and higher than 0.');

    const query = trx ? trx.query.truck : db.query.truck;

    return query.findFirst({
      where: (truck) => eq(truck.id, truckId),
    });
  },

  getTruckByPlateQuery: (truckPlate: string) =>
    db.query.truck.findFirst({
      where: (truck) => eq(truck.plate, truckPlate),
    }),

  createTruckQuery: async (newTruck: Truck) => {
    const createdTruck = await db.insert(truck).values(newTruck).returning();

    return createdTruck[0];
  },

  deleteTruckQuery: async (truckId: number) => {
    if (!truckId || truckId < 1)
      throw new Error('TruckID must be provided and higher than 0.');

    const deletedTruck = await db
      .delete(truck)
      .where(eq(truck.id, truckId))
      .returning();

    return deletedTruck[0];
  },

  updateTruckQuery: async (
    truckId: number,
    newTruckData: Partial<Truck>,
    trx?: dbTransaction
  ) => {
    if (!truckId || truckId < 1)
      throw new Error('TruckID must be provided and higher than 0.');

    const query = trx ? trx.update(truck) : db.update(truck);
    const updatedTruck = await query
      .set(newTruckData)
      .where(eq(truck.id, truckId))
      .returning();

    return updatedTruck[0];
  },
};
