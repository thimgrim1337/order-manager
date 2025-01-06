import { eq } from 'drizzle-orm';
import db from '../../db/index';
import truck from '../../db/schema/truck';
import { Truck } from './trucks.model';

export const truckServices = {
  getTrucksQuery: () => db.query.truck.findMany(),

  getTruckByIdQuery: (truckId: number) =>
    db.query.truck.findFirst({
      where: (truck) => eq(truck.id, truckId),
    }),

  getTruckByPlateQuery: (truckPlate: string) =>
    db.query.truck.findFirst({
      where: (truck) => eq(truck.plate, truckPlate),
    }),

  createTruckQuery: (newTruck: Truck) =>
    db.insert(truck).values(newTruck).returning(),

  deleteTruckQuery: (truckId: number) =>
    db.delete(truck).where(eq(truck.id, truckId)).returning(),

  updateTruckQuery: (truckToUpdate: Truck, truckId: number) =>
    db
      .update(truck)
      .set(truckToUpdate)
      .where(eq(truck.id, truckId))
      .returning(),
};
