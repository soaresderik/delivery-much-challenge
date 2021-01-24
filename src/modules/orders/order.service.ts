import { ProductRepository, IProduct } from '@modules/products';
import HttpException from '@shared/errors/HttpException';
import { OrderRepository, IOrderDTO, IOrder } from '.';

export default class OrderService {
  constructor(
    private orderRepository = new OrderRepository(),
    private productRepository = new ProductRepository(),
  ) {}

  public async findOne(id: string) {
    const order = await this.orderRepository.findOne({ id });

    return {
      id: order.id,
      products: order.products,
      total: order.total,
    };
  }

  public async create(ordered: IOrderDTO[]): Promise<IOrder> {
    const products = await this.productRepository.findByNames(
      ordered.map(product => product.name),
    );

    const orderItems: IProduct[] = [];

    products.forEach(product => {
      ordered.forEach(order => {
        if (product.name === order.name) {
          if (product.quantity < order.quantity)
            throw new HttpException(
              `O produto ${product.name} contém apenas ${product.quantity} unidade(s) disponível no estoque`,
              400,
            );

          orderItems.push({
            name: order.name,
            price: product.price,
            quantity: order.quantity,
          });
        }
      });
    });

    const order = await this.orderRepository.store(orderItems);

    return {
      id: order.id,
      products: order.products,
      total: order.total,
    };
  }
}
