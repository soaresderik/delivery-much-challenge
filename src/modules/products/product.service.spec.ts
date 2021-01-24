import { ProductService, ProductRepository } from '.';
import { draftProduct } from './__mocks__';
import { IProduct } from './product.interface';

describe('Product Module', () => {
  it('should be find a product by name', async () => {
    const name = 'caramelo';
    ProductRepository.prototype.findOne = jest
      .fn()
      .mockImplementation(() => draftProduct({ name })[0]);

    const productService = new ProductService();

    const product = await productService.findByName(name);

    expect(product.name).toBe(name);
  });

  it('should be throw an error [Not Found]', async () => {
    try {
      ProductRepository.prototype.findOne = jest
        .fn()
        .mockImplementation(() => null);

      const productService = new ProductService();

      // Não vai encontrar pois o correto é bolacha :D
      const product = await productService.findByName('biscoito');

      expect(product).toBeFalsy();
    } catch (err) {
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Produto não encontrado.');
    }
  });

  it('should be update stock [incremented]', async () => {
    const params = {
      name: 'Caramelo',
      quantity: 10,
    };

    ProductRepository.prototype.findOne = jest
      .fn()
      .mockImplementation(
        () => draftProduct({ name: params.name, quantity: params.quantity })[0],
      );

    ProductRepository.prototype.update = jest
      .fn()
      .mockImplementation(
        () =>
          draftProduct({ name: params.name, quantity: params.quantity + 1 })[0],
      );

    const productService = new ProductService();

    const product = (await productService.updateStock({
      increment: true,
      name: params.name,
    })) as IProduct;

    expect(product).not.toBeNull();
    expect(product.quantity).toBe(11);
  });

  it('should be update stock [decremented]', async () => {
    const params = {
      name: 'Caramelo',
      quantity: 10,
    };

    ProductRepository.prototype.findOne = jest
      .fn()
      .mockImplementation(
        () => draftProduct({ name: params.name, quantity: params.quantity })[0],
      );

    ProductRepository.prototype.update = jest
      .fn()
      .mockImplementation(
        () =>
          draftProduct({ name: params.name, quantity: params.quantity - 1 })[0],
      );

    const productService = new ProductService();

    const product = (await productService.updateStock({
      increment: false,
      name: params.name,
    })) as IProduct;

    expect(product).not.toBeNull();
    expect(product.quantity).toBe(9);
  });

  it('should be do nothing if product in stock has quantity equals 0', async () => {
    const params = {
      name: 'Caramelo',
      quantity: 0,
    };

    ProductRepository.prototype.findOne = jest
      .fn()
      .mockImplementation(
        () => draftProduct({ name: params.name, quantity: params.quantity })[0],
      );

    const productService = new ProductService();

    const product = (await productService.updateStock({
      increment: false,
      name: params.name,
    })) as IProduct;

    expect(product).toBeNull();
  });
});
