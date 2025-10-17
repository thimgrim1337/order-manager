import express from 'express';
import trucks from './trucks/trucks.routes';
import drivers from './drivers/drivers.routes';
import customers from './customers/customers.routes';
import cities from './cities/cities.routes';
import orders from './orders/orders.routes';
import countries from './countries/countries.routes';
import holidays from './holidays/holidays.routes';
import users from './users/users.routes';
import auth from './jwt/auth/auth.routes';
import refresh from './jwt/refresh/refreshToken.routes';
import verifyJWT from '@/middleware/verifyJWT';

const router = express.Router();

router.use('/', auth);
router.use('/', refresh);

router.use(verifyJWT);
router.use('/trucks', trucks);
router.use('/drivers', drivers);
router.use('/customers', customers);
router.use('/cities', cities);
router.use('/orders', orders);
router.use('/countries', countries);
router.use('/holidays', holidays);
router.use('/users', users);

export default router;
