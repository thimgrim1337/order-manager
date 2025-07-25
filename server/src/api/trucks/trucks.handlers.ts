import { RequestHandler } from 'express';
import { Truck, TruckWithId } from './trucks.model';
import { AppError } from '../../lib/app-error';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { truckServices } from './trucks.services';

export const getAllTrucks: RequestHandler = async (req, res, next) => {
  try {
    const trucks = await truckServices.getTrucksQuery();
    res.status(200).json(trucks);
  } catch (error) {
    next(new AppError('Failed to fetch trucks', 500));
  }
};

export const getTruckById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const existingTruck = await truckServices.getTruckByIdQuery(+id);

    if (!existingTruck) throw new AppError('Truck does not exist.', 404);

    res.status(200).json(existingTruck);
  } catch (error) {
    next(error);
  }
};

export const createTruck: RequestHandler = async (req, res, next) => {
  try {
    const { plate } = req.body as Truck;

    const existingTruck = await truckServices.getTruckByPlateQuery(plate);

    if (existingTruck) {
      throw new AppError('Truck already exist.', 409);
    }

    const addedTruck = await truckServices.createTruckQuery(req.body);
    res.status(201).json(addedTruck);
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
    const { id } = req.params as ParamsWithId;

    const existingTruck = await truckServices.getTruckByIdQuery(+id);

    if (!existingTruck) throw new AppError('Truck does not exist.', 404);

    const deletedTruck = await truckServices.deleteTruckQuery(+id);

    res.status(200).json(deletedTruck);
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
    const { id } = req.params as ParamsWithId;

    const existingTruck = await truckServices.getTruckByIdQuery(+id);

    if (!existingTruck) throw new AppError('Truck does not exist.', 404);
    const updatedTruck = await truckServices.updateTruckQuery(+id, req.body);

    res.status(200).json(updatedTruck);
  } catch (error) {
    next(error);
  }
};
