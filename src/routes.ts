import { Router } from 'express';

import { productRoutes } from '@modules/products';
import { orderRoutes } from '@modules/orders';

const routes = Router();

routes.use('/products', productRoutes);
routes.use('/orders', orderRoutes);

export default routes;
