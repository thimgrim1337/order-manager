import { Router } from 'express';
import * as handlers from './places.handlers';
import { validateRequest } from '../../middleware/validate-request';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { PlaceWithFullAddress } from './places.model';

const router = Router();

router.get('/', handlers.getAllPlaces);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getPlaceById
);

router.post(
  '/',
  validateRequest({
    body: PlaceWithFullAddress,
  }),
  handlers.addPlace
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deletePlace
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: PlaceWithFullAddress,
  }),
  handlers.updatePlace
);

export default router;
