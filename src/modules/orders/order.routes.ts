import validator from '@middlewares/validator.middleware';
import { Router } from 'express';
import { OrderService } from '.';

const routes = Router();
const orderService = new OrderService();

routes.post(
  '/',
  validator({
    products: 'required|array',
    'products.*.name': 'required|string',
    'products.*.quantity': 'required|range:1,999',
  }),
  async (req, res) => {
    const { products } = req.body;
    res.json(await orderService.create(products));
  },
);

routes.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  res.json(await orderService.findOne(orderId));
});

export default routes;
