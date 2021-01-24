import Repository from '@modules/repository.base';
import { knex } from '@config/index';

import { IProduct } from './product.interface';

export default class ProductRepository extends Repository<IProduct> {
  constructor(db = knex) {
    super('products', db);
  }

  public async findByNames(names: string[]) {
    const products = await this.db<IProduct>('products')
      .select('*')
      .whereIn('name', names);

    return products;
  }
}
