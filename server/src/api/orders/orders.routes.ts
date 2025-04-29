import { Router } from 'express';
import * as handlers from './orders.handlers';
import { validateRequest } from '@/middleware/validate-request';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import { Order } from './orders.model';
import { QueryParams } from '@/interfaces/QueryParams';
const router = Router();

router.get(
  '/',
  validateRequest({
    query: QueryParams,
  }),
  handlers.getAllOrders
);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getOrderById
);

router.post(
  '/',
  validateRequest({
    body: Order,
  }),
  handlers.addOrder
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Order,
  }),
  handlers.updateOrder
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.deleteOrder
);

export default router;
