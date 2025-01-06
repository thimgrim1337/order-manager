import { and, eq } from 'drizzle-orm';
import db from '@/db/index';
import { driver } from '../../db/schema/index';
import { Driver } from './drivers.model';

export const driverServices = {
  getDriversQuery: () => db.query.driver.findMany(),

  getDriverByIdQuery: (driverId: number) =>
    db.query.driver.findFirst({
      where: (driver) => eq(driver.id, driverId),
    }),

  getDriverByNameQuery: (fullName: { firstName: string; lastName: string }) =>
    db.query.driver.findFirst({
      where: (driver) =>
        and(
          eq(driver.firstName, fullName.firstName),
          eq(driver.lastName, fullName.lastName)
        ),
    }),

  createDriverQuery: (newDriver: Driver) =>
    db.insert(driver).values(newDriver).returning(),

  deleteDriverQuery: (driverId: number) =>
    db.delete(driver).where(eq(driver.id, driverId)).returning(),

  updateDriverQuery: (driverToUpdate: Driver, driverId: number) =>
    db
      .update(driver)
      .set(driverToUpdate)
      .where(eq(driver.id, driverId))
      .returning(),
};
