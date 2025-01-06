import { Router } from 'express';
import * as handlers from '../trucks/trucks.handlers';
import { validateRequest } from '../../middleware/validate-request';
import { Truck } from './trucks.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router: Router = Router();

router.get('/', handlers.getAllTrucks);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getTruckById
);

router.post(
  '/',
  validateRequest({
    body: Truck,
  }),
  handlers.addTruck
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deleteTruck
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Truck,
  }),
  handlers.updateTruck
);

export default router;
