import { RequestHandler } from 'express';
import { Truck, TruckWithId } from './trucks.model';
import { AppError } from '../../lib/app-error';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { truckServices } from './trucks.services';

export const getAllTrucks: RequestHandler<{}, Truck[]> = async (
  req,
  res,
  next
) => {
  try {
    const trucks = await truckServices.getTrucksQuery();
    res.status(200).json(trucks);
  } catch (error) {
    next(new AppError('Failed to fetch trucks', 500));
  }
};

export const getTruckById: RequestHandler<
  ParamsWithId,
  TruckWithId | {}
> = async (req, res, next) => {
  try {
    const truck = await truckServices.getTruckByIdQuery(+req.params.id);

    if (!truck) res.status(404).json({});

    res.status(200).json(truck);
  } catch (error) {
    next(new AppError('Failed to fetch truck.', 500));
  }
};

export const addTruck: RequestHandler<{}, TruckWithId, Truck> = async (
  req,
  res,
  next
) => {
  try {
    const newTruck = req.body;

    const isExist = await truckServices.getTruckByPlateQuery(newTruck.plate);

    if (isExist) {
      throw new AppError('Truck already exist.', 409);
    }

    const addedTruck = await truckServices.createTruckQuery(newTruck);
    res.status(201).json(addedTruck[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteTruck: RequestHandler<ParamsWithId, TruckWithId> = async (
  req,
  res,
  next
) => {
  try {
    const deletedTruck = await truckServices.deleteTruckQuery(+req.params.id);

    if (!deletedTruck.length) {
      throw new AppError('Truck does not exist', 404);
    }

    res.status(200).json(deletedTruck[0]);
  } catch (error) {
    next(error);
  }
};

export const updateTruck: RequestHandler<
  ParamsWithId,
  TruckWithId,
  TruckWithId
> = async (req, res, next) => {
  try {
    const updatedTruck = await truckServices.updateTruckQuery(
      req.body,
      +req.params.id
    );
    res.status(200).json(updatedTruck[0]);
  } catch (error) {
    next(error);
  }
};
