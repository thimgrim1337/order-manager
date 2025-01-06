import { RequestHandler } from 'express';
import { AppError } from '../../lib/app-error';
import { driverServices } from './drivers.services';
import { Driver, DriverWithId } from './drivers.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

export const getAllDrivers: RequestHandler<{}, Driver[]> = async (
  req,
  res,
  next
) => {
  try {
    const drivers = await driverServices.getDriversQuery();
    res.status(200).json(drivers);
  } catch (error) {
    next(new AppError('Failed to fetch drivers', 500));
  }
};

export const getDriverById: RequestHandler<ParamsWithId, DriverWithId> = async (
  req,
  res,
  next
) => {
  try {
    const driver = await driverServices.getDriverByIdQuery(+req.params.id);

    if (!driver) res.status(404).json();

    res.status(200).json(driver);
  } catch (error) {
    next(new AppError('Failed to fetch driver', 500));
  }
};

export const addDriver: RequestHandler<{}, Driver, DriverWithId> = async (
  req,
  res,
  next
) => {
  try {
    const newDriver = req.body;

    const isExist = await driverServices.getDriverByNameQuery(newDriver);

    if (isExist) {
      throw new AppError('Driver already exist.', 409);
    }

    const addedDriver = await driverServices.createDriverQuery(newDriver);
    res.status(201).json(addedDriver[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteDriver: RequestHandler<ParamsWithId, DriverWithId> = async (
  req,
  res,
  next
) => {
  try {
    const deletedDriver = await driverServices.deleteDriverQuery(
      +req.params.id
    );

    if (!deletedDriver.length) {
      throw new AppError('Driver does not exist.', 404);
    }

    res.status(200).json(deletedDriver[0]);
  } catch (error) {
    next(error);
  }
};

export const updateDriver: RequestHandler<
  ParamsWithId,
  DriverWithId,
  Driver
> = async (req, res, next) => {
  try {
    const driverToUpdate = req.body;

    const updatedDriver = await driverServices.updateDriverQuery(
      driverToUpdate,
      +req.params.id
    );
    res.status(200).json(updatedDriver[0]);
  } catch (error) {
    next(error);
  }
};
