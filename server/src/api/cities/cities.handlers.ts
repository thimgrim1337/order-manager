import { RequestHandler } from 'express';
import { CityWithId, CityWithIdAndCountry } from './cities.model';
import { citiesServices } from './cities.services';
import { AppError } from '@/lib/app-error';
import { ParamsWithId } from '@/interfaces/ParamsWithId';

export const getAllCities: RequestHandler<{}, CityWithIdAndCountry[]> = async (
  req,
  res,
  next
) => {
  try {
    const cities = await citiesServices.getCitiesQuery();
    res.status(200).send(cities);
  } catch (error) {
    next(new AppError('Failed to fetch cities', 500));
  }
};

export const getCityById: RequestHandler<
  ParamsWithId,
  CityWithId | {}
> = async (req, res, next) => {
  try {
    const city = await citiesServices.getCityByIdQuery(+req.params.id);

    if (!city) res.status(404).send({});

    res.status(200).json(city);
  } catch (error) {
    next(new AppError('Failed to fetch city', 500));
  }
};

export const addCity: RequestHandler<
  {},
  CityWithId,
  CityWithIdAndCountry
> = async (req, res, next) => {
  try {
    const { name, countryID } = req.body;

    const existingCity = await citiesServices.getCityByNameQuery(name);
    if (existingCity) throw new AppError('City already exist', 409);

    const newCity = req.body;

    const createdCity = await citiesServices.addCityQuery(newCity);

    res.status(201).json(createdCity[0]);
  } catch (error) {
    next(error);
  }
};

export const updateCity: RequestHandler<
  ParamsWithId,
  CityWithId,
  CityWithIdAndCountry
> = async (req, res, next) => {
  try {
    const cityID = +req.params.id;
    const { name } = req.body;
    const existingCity = await citiesServices.getCityByIdQuery(cityID);

    if (!existingCity) throw new AppError('City does not exist.', 404);

    const updatedCityObj = req.body;

    const updatedCity = await citiesServices.updateCityQuery(
      cityID,
      updatedCityObj
    );

    res.status(200).json(updatedCity[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCity: RequestHandler<ParamsWithId, CityWithId> = async (
  req,
  res,
  next
) => {
  try {
    const deletedCity = await citiesServices.deleteCityQuery(+req.params.id);

    if (!deletedCity.length) throw new AppError('City does not exist', 404);

    if (!deletedCity[0])
      throw new AppError('Something went wrong when deleting place.', 404);

    res.status(200).json(deletedCity[0]);
  } catch (error) {
    next(error);
  }
};
