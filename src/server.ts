/* eslint-disable no-console */
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';
import { ProductService } from '@modules/products';
import RabbitMQServer from '@shared/rabbitmq-server';
import HttpException from '@shared/errors/HttpException';
import routes from './routes';
import { knex, rabbitConfig } from './config';

(async () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use(routes);

  await knex.migrate.latest().catch(err => {
    throw err;
  });

  app.use(
    (err: Error, request: Request, response: Response, _: NextFunction) => {
      if (err instanceof HttpException) {
        return response.status(err.statusCode).json({
          status: err.statusCode || 500,
          message: err.message,
        });
      }

      console.log({ err });
      return response.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    },
  );

  const rabbit = new RabbitMQServer(rabbitConfig.rabbitMQUrl);
  await rabbit.start('products', {
    bindkeys: ['incremented', 'decremented'],
    name: 'stock',
  });
  await rabbit.consume('products', async msg => {
    const productName = msg?.content.toString();

    if (productName) {
      await new ProductService().updateStock({
        name: JSON.parse(productName),
        increment: msg?.fields.routingKey === 'incremented',
      });
    }
  });

  app.listen(3002, () => {
    console.log('Server started on port 3002!');
  });
})();
