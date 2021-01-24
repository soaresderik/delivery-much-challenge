import Knex from 'knex';
import database from './knexfile';

export const jwtConfig = (() => {
  const secret = process.env.APP_SECRET as string;

  if (!secret || !secret.length) throw new Error('APP_SECRET not defined.');

  return {
    secret,
    expiresIn: '1d',
  };
})();

export const rabbitConfig = (() => {
  const rabbitMQUrl = process.env.RABBITMQ_URL as string;

  if (!rabbitMQUrl || !rabbitMQUrl.length)
    throw new Error('RABBITMQ_URL not defined.');

  return {
    rabbitMQUrl,
  };
})();

export const knex = Knex(database);
