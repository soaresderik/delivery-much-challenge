import * as Knex from 'knex';
import { createTable, dropTable } from '../shared/helpers/knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await createTable(knex, 'products', table => {
    table.string('name').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('quantity').notNullable().defaultTo(0);
  });

  await createTable(knex, 'orders', table => {
    table.jsonb('products').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await dropTable(knex, 'products');
}
