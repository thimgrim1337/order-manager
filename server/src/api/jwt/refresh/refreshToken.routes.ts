import { Router } from 'express';
import * as handlers from './refreshToken.handlers';

const router: Router = Router();

router.get('/refresh', handlers.handleRefreshToken);

export default router;
