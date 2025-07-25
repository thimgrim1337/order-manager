import { RequestHandler } from 'express';
import { City } from './cities.model';
import { citiesServices } from './cities.services';
import { AppError } from '@/lib/app-error';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import db from '@/db';
import { placesServices } from '../places/places.services';

export const getAllCities: RequestHandler = async (req, res, next) => {
  try {
    const cities = await citiesServices.getCitiesQuery();
    res.status(200).send(cities);
  } catch (error) {
    next(new AppError('Failed to fetch cities: ' + error, 500));
  }
};

export const getCityById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    const existingCity = await citiesServices.getCityByIdQuery(+id);

    if (!existingCity) throw new AppError('City does not exist.', 404);

    res.status(200).json(existingCity);
  } catch (error) {
    next(error);
  }
};

export const createCity: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body as City;

    const existingCity = await citiesServices.getCityByNameQuery(name);

    if (existingCity) throw new AppError('City already exist', 409);

    const createdCity = await citiesServices.createCityQuery(req.body);

    res.status(201).json(createdCity);
  } catch (error) {
    next(error);
  }
};

export const updateCity: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    const existingCity = await citiesServices.getCityByIdQuery(+id);

    if (!existingCity) throw new AppError('City doest not exist.', 404);

    const updatedCity = await citiesServices.updateCityQuery(+id, req.body);

    res.status(200).json(updatedCity);
  } catch (error) {
    next(error);
  }
};

export const deleteCity: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    const existingCity = await citiesServices.getCityByIdQuery(+id);

    if (existingCity) throw new AppError('City doest not exist.', 404);

    // TODO: Usuwanie miasta narusza klucz podstawowy w tablicy order_loading_palces oraz order_unloading_places
    const deletedCity = {};

    res.status(200).json(deletedCity);
  } catch (error) {
    next(new AppError('Failed to delete city: ' + error, 500));
  }
};
