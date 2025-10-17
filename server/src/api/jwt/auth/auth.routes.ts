import { Router } from 'express';
import * as handlers from './auth.handlers';
import * as userHandlers from '../../users/users.handlers';
import { validateRequest } from '@/middleware/validate-request';
import { User } from '@/api/users/users.model';

const router: Router = Router();

router.post(
  '/register',
  validateRequest({ body: User }),
  userHandlers.createUser
);
router.post('/login', validateRequest({ body: User }), handlers.handleLogin);
router.get('/logout', handlers.handleLogout);

export default router;
