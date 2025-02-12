import { Router } from 'express';
import * as handlers from './countries.handlers';
import { validateRequest } from '../../middleware/validate-request';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

router.get('/', handlers.getAllCountries);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getCountryById
);

// router.post(
//   '/',
//   validateRequest({
//     body: CountryWithId,
//   }),
//   handlers.addCity
// );

// router.delete(
//   '/:id',
//   validateRequest({
//     params: ParamsWithId,
//   }),
//   handlers.deleteCity
// );

// router.patch(
//   '/:id',
//   validateRequest({
//     params: ParamsWithId,
//     body: CountryWithId,
//   }),
//   handlers.updateCity
// );

export default router;
