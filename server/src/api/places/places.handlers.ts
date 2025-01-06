import { RequestHandler } from 'express';
import {
  PlaceWithFullAddress,
  PlaceWithId,
  PlaceWithIdWithFullAddress,
} from './places.model';
import { placesServices } from './places.services';
import { AppError } from '@/lib/app-error';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import * as addressHandlers from '../addresses/addresses.handlers';

export const getAllPlaces: RequestHandler<
  {},
  PlaceWithIdWithFullAddress[]
> = async (req, res, next) => {
  try {
    const places = await placesServices.getPlacesQuery();
    res.status(200).send(places);
  } catch (error) {
    next(new AppError('Failed to fetch places', 500));
  }
};

export const getPlaceById: RequestHandler<
  ParamsWithId,
  PlaceWithId | {}
> = async (req, res, next) => {
  try {
    const place = await placesServices.getPlaceByIdQuery(+req.params.id);

    if (!place) res.status(404).send({});

    res.status(200).json(place);
  } catch (error) {
    next(new AppError('Failed to fetch place', 500));
  }
};

export const addPlace: RequestHandler<
  {},
  PlaceWithId,
  PlaceWithFullAddress
> = async (req, res, next) => {
  try {
    const { id, name, address } = req.body;

    const existingPlace = await placesServices.getPlaceByNameQuery(name);
    if (existingPlace) throw new AppError('Place already exist', 409);

    const addressID = await addressHandlers.addAddress(address);

    if (!addressID)
      throw new AppError('Something went wrong when adding place.', 500);

    const newPlace = {
      id,
      name,
      addressID,
    };

    const createdPlace = await placesServices.addPlaceQuery(newPlace);

    res.status(201).json(createdPlace[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePlace: RequestHandler<
  ParamsWithId,
  PlaceWithId,
  PlaceWithFullAddress
> = async (req, res, next) => {
  try {
    const placeID = +req.params.id;
    const { name, address } = req.body;
    const existingPlace = await placesServices.getPlaceByIdQuery(placeID);

    if (!existingPlace) throw new AppError('Place does not exist.', 404);

    const addressID = await addressHandlers.updateAddress(
      existingPlace.addressID,
      address
    );

    if (!addressID)
      throw new AppError('Something went wrong when updating address.', 500);

    const updatedPlaceObj = {
      name,
      addressID,
    };

    const updatedPlace = await placesServices.updatePlaceQuery(
      placeID,
      updatedPlaceObj
    );

    res.status(200).json(updatedPlace[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePlace: RequestHandler<ParamsWithId, PlaceWithId> = async (
  req,
  res,
  next
) => {
  try {
    const deletedPlace = await placesServices.deletePlaceQuery(+req.params.id);

    if (!deletedPlace.length) throw new AppError('Place does not exist', 404);

    if (!deletedPlace[0])
      throw new AppError('Something went wrong when deleting place.', 404);

    await addressHandlers.deleteAddress(deletedPlace[0].addressID);

    res.status(200).json(deletedPlace[0]);
  } catch (error) {
    next(error);
  }
};
