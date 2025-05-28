import { Router } from 'express';
import * as handlers from './holidays.handlers';

const router: Router = Router();

router.get('/', handlers.getAllHolidays);

export default router;
