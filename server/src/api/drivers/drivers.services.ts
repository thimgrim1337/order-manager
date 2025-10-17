import { and, eq } from 'drizzle-orm';
import db, { dbTransaction } from '@/db/index';
import { driver } from '../../db/schema/index';
import { Driver } from './drivers.model';

export const driverServices = {
  getDriversQuery: () =>
    db.query.driver.findMany({
      orderBy: (driver) => driver.id,
    }),

  getDriverByIdQuery: (driverId: number, trx?: dbTransaction) => {
    if (!driverId || driverId < 1)
      throw new Error('DriverID must be provided and be higher than 0.');

    const query = trx ? trx.query.driver : db.query.driver;

    return query.findFirst({
      where: (driver) => eq(driver.id, driverId),
    });
  },

  getDriverByNameQuery: (fullName: { firstName: string; lastName: string }) => {
    return db.query.driver.findFirst({
      where: (driver) =>
        and(
          eq(driver.firstName, fullName.firstName),
          eq(driver.lastName, fullName.lastName)
        ),
    });
  },

  createDriverQuery: async (newDriver: Driver) => {
    const createdDriver = await db.insert(driver).values(newDriver).returning();
    return createdDriver[0];
  },

  deleteDriverQuery: async (driverId: number) => {
    if (!driverId || driverId < 1)
      throw new Error('DriverID must be provided and be higher than 0.');

    const deletedDriver = await db
      .delete(driver)
      .where(eq(driver.id, driverId))
      .returning();

    return deletedDriver[0];
  },

  updateDriverQuery: async (
    driverId: number,
    newDriverData: Partial<Driver>,
    trx?: dbTransaction
  ) => {
    if (!driverId || driverId < 1)
      throw new Error('DriverID must be provided and be higher than 0.');

    const query = trx ? trx.update(driver) : db.update(driver);
    const updatedDriver = await query
      .set(newDriverData)
      .where(eq(driver.id, driverId))
      .returning();
    return updatedDriver[0];
  },

  ensureDriverHasAssigedTruck: async (
    driverID: number,
    truckID: number,
    trx: dbTransaction
  ) => {
    if (!driverID || !truckID) return;

    const driver = await driverServices.getDriverByIdQuery(driverID, trx);

    if (!driver) throw new Error('Driver doest not exist.');

    if (!driver.truckID) {
      await driverServices.updateDriverQuery(driverID, { truckID }, trx);
    }
  },
};
