import { RequestHandler } from 'express';
import { countriesServices } from './countries.services';
import { AppError } from '@/lib/app-error';
import { ParamsWithId } from '@/interfaces/ParamsWithId';

export const getAllCountries: RequestHandler = async (req, res, next) => {
  try {
    const countries = await countriesServices.getCountriesQuery();
    res.status(200).send(countries);
  } catch (error) {
    next(new AppError('Failed to fetch countries ' + error, 500));
  }
};

export const getCountryById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const country = await countriesServices.getCountryByIdQuery(+id);

    if (!country) throw new AppError('Country does not exist.', 404);

    res.status(200).json(country);
  } catch (error) {
    next(error);
  }
};
