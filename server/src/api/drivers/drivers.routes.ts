import { Router } from 'express';
import * as handlers from '../drivers/drivers.handlers';
import { validateRequest } from '../../middleware/validate-request';
import { Driver } from './drivers.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router: Router = Router();

router.get('/', handlers.getAllDrivers);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getDriverById
);

router.post(
  '/',
  validateRequest({
    body: Driver,
  }),
  handlers.addDriver
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deleteDriver
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Driver,
  }),
  handlers.updateDriver
);

export default router;
