import { Router } from 'express';
import { ProductService } from '.';

const routes = Router();
const productService = new ProductService();

routes.get('/:name', async (req, res) => {
  res.json(await productService.findByName(req.params.name));
});

export default routes;
