import HttpException from '@shared/errors/HttpException';
import { ProductRepository } from '.';

export default class ProductService {
  constructor(private productRepository = new ProductRepository()) {}

  public async findByName(name: string) {
    const product = await this.productRepository.findOne({ name });

    if (!product) {
      throw new HttpException('Produto não encontrado.', 404);
    }

    return {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
  }

  public async updateStock(params: { name: string; increment: boolean }) {
    const product = await this.productRepository.findOne({
      name: params.name,
    });

    let updated = null;
    if (product?.id && (product.quantity || params.increment)) {
      const fields = {
        quantity: params.increment
          ? product.quantity + 1
          : product.quantity - 1,
      };

      updated = await this.productRepository.update({ id: product.id }, fields);
    }

    return updated;
  }
}
