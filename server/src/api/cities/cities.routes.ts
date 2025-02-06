import { Router } from 'express';
import * as handlers from './cities.handlers';
import { validateRequest } from '../../middleware/validate-request';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { CityWithId } from './cities.model';

const router = Router();

router.get('/', handlers.getAllCities);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getCityById
);

router.post(
  '/',
  validateRequest({
    body: CityWithId,
  }),
  handlers.addCity
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deleteCity
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: CityWithId,
  }),
  handlers.updateCity
);

export default router;
