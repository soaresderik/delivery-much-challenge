import Repository from '@modules/repository.base';
import { IProduct } from '@modules/products';
import { knex } from '@config/index';
import HttpException from '@shared/errors/HttpException';
import { IOrder } from './order.interfaces';

export default class OrderRepository extends Repository<IOrder> {
  constructor(protected db = knex) {
    super('orders', db);
  }

  public async findOne(params: Partial<IOrder>) {
    const order = await super.findOne(params);

    if (!order) throw new HttpException('Pedido não encontrado', 404);

    return {
      ...order,
      total: this.calcTotal(order.products as IProduct[]),
    };
  }

  public async store(ordered: IProduct[]) {
    const trx = await this.db.transaction();
    try {
      const [order] = await trx<IOrder>('orders')
        .insert({ products: JSON.stringify(ordered) })
        .returning('*');

      await Promise.all(
        ordered.map(async product => {
          await trx.raw(
            'UPDATE products SET quantity = quantity - :quantity WHERE name = :name',
            { name: product.name, quantity: product.quantity },
          );
        }),
      );

      await trx.commit();
      return {
        ...order,
        total: this.calcTotal(order.products as IProduct[]),
      };
    } catch (err) {
      await trx.rollback();
      throw new HttpException(
        'Ocorreu um erro ao salvar. Por favor tente novamente',
        500,
      );
    }
  }

  private calcTotal(products: IProduct[]) {
    return products.reduce((a, b) => a + +b.price * b.quantity, 0).toFixed(2);
  }
}
