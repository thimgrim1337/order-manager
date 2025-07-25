import { Router } from 'express';
import * as handlers from './orders.handlers';
import { validateRequest } from '@/middleware/validate-request';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import {
  Order,
  OrderFilters,
  OrderWithIdAndPlaces,
  OrderWithPlaces,
} from './orders.model';

const router = Router();

router.get(
  '/',
  validateRequest({
    query: OrderFilters,
  }),
  handlers.getFilterdOrders
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
    body: OrderWithPlaces,
  }),
  handlers.createOrder
);

router.patch(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: OrderWithIdAndPlaces,
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
