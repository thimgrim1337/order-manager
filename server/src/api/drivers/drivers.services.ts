import { and, eq } from 'drizzle-orm';
import db from '@/db/index';
import { driver } from '../../db/schema/index';
import { Driver } from './drivers.model';

export const driverServices = {
  getDriversQuery: () => db.query.driver.findMany(),

  getDriverByIdQuery: (driverId: number) => {
    if (!driverId || driverId < 1)
      throw new Error('DriverID must be provided and be higher than 0.');
    return db.query.driver.findFirst({
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

  updateDriverQuery: async (driverId: number, driverToUpdate: Driver) => {
    if (!driverId || driverId < 1)
      throw new Error('DriverID must be provided and be higher than 0.');
    const updatedDriver = await db
      .update(driver)
      .set(driverToUpdate)
      .where(eq(driver.id, driverId))
      .returning();
    return updatedDriver[0];
  },
};
