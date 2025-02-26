import { RequestHandler } from 'express';
import { CountryWithId } from './countries.model';
import { countriesServices } from './countries.services';
import { AppError } from '@/lib/app-error';
import { ParamsWithId } from '@/interfaces/ParamsWithId';

export const getAllCountries: RequestHandler<{}, CountryWithId[]> = async (
  req,
  res,
  next
) => {
  try {
    const cities = await countriesServices.getCountriesQuery();
    res.status(200).send(cities);
  } catch (error) {
    next(new AppError('Failed to fetch countries.', 500));
  }
};

export const getCountryById: RequestHandler<
  ParamsWithId,
  CountryWithId | {}
> = async (req, res, next) => {
  try {
    const country = await countriesServices.getCountryByIdQuery(+req.params.id);

    if (!country) res.status(404).send({});

    res.status(200).json(country);
  } catch (error) {
    next(new AppError('Failed to fetch country', 500));
  }
};
