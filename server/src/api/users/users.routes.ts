import { Router } from 'express';
import * as handlers from './users.handlers';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import { validateRequest } from '@/middleware/validate-request';

const router: Router = Router();

router.get('/users', handlers.getAllUsers);

router.get(
  '/users/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  handlers.getUserById
);

export default router;
