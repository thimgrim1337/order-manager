import express from 'express';
import trucks from './trucks/trucks.routes';
import drivers from './drivers/drivers.routes';
import customers from './customers/customers.routes';
import places from './places/places.routes';
import orders from './orders/orders.routes';

const router = express.Router();

router.use('/trucks', trucks);
router.use('/drivers', drivers);
router.use('/customers', customers);
router.use('/places', places);
router.use('/orders', orders);

export default router;
