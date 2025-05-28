import express from 'express';
import trucks from './trucks/trucks.routes';
import drivers from './drivers/drivers.routes';
import customers from './customers/customers.routes';
import cities from './cities/cities.routes';
import orders from './orders/orders.routes';
import countries from './countries/countries.routes';
import holidays from './holidays/holidays.routes';
const router = express.Router();

router.use('/trucks', trucks);
router.use('/drivers', drivers);
router.use('/customers', customers);
router.use('/cities', cities);
router.use('/orders', orders);
router.use('/countries', countries);
router.use('/holidays', holidays);

export default router;
