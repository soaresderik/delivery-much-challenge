/* eslint-disable no-console */
// import { knex } from "./config"
import csvtojson from 'csvtojson';
import { knex } from './config';

(async () => {
  try {
    const products = await csvtojson().fromFile(`${__dirname}/products.csv`);

    await knex('products').insert(products);

    console.log('Completed!');
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
