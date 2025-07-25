import { Router } from 'express';
import * as handlers from './customers.handlers';
import { validateRequest } from '@/middleware/validate-request';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import { Customer, CustomerWithId } from './customers.model';

const router = Router();

router.get('/', handlers.getAllCustomers);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getCustomerById
);

router.post(
  '/',
  validateRequest({
    body: Customer,
  }),
  handlers.createCustomer
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deleteCustomer
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Customer,
  }),
  handlers.updateCustomer
);

export default router;
