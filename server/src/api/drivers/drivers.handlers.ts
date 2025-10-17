import { RequestHandler } from 'express';
import { AppError } from '../../lib/app-error';
import { driverServices } from './drivers.services';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

export const getAllDrivers: RequestHandler = async (req, res, next) => {
  try {
    const drivers = await driverServices.getDriversQuery();
    res.status(200).json(drivers);
  } catch (error) {
    next(new AppError('Failed to fetch drivers: ' + error, 500));
  }
};

export const getDriverById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const existingDriver = await driverServices.getDriverByIdQuery(+id);

    if (!existingDriver) throw new AppError('Driver does not exist.', 404);

    res.status(200).json(existingDriver);
  } catch (error) {
    next(error);
  }
};

export const addDriver: RequestHandler = async (req, res, next) => {
  try {
    const existingDriver = await driverServices.getDriverByNameQuery(req.body);

    if (existingDriver) {
      throw new AppError('Driver already exist.', 409);
    }

    const createdDriver = await driverServices.createDriverQuery(req.body);
    res.status(201).json(createdDriver);
  } catch (error) {
    next(error);
  }
};

export const deleteDriver: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    const deletedDriver = await driverServices.deleteDriverQuery(+id);

    if (!deletedDriver) throw new AppError('Driver does not exist.', 404);

    res.status(200).json(deletedDriver);
  } catch (error) {
    next(error);
  }
};

export const updateDriver: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const existingDriver = await driverServices.getDriverByIdQuery(+id);

    if (!existingDriver) throw new AppError('Driver does not exist.', 404);

    const updatedDriver = await driverServices.updateDriverQuery(+id, req.body);

    res.status(200).json(updatedDriver);
  } catch (error) {
    next(error);
  }
};
