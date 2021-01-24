import { ProductRepository } from '@modules/products';
import { draftProduct } from '@modules/products/__mocks__';
import { draftOrder } from './__mocks__';
import { OrderService, OrderRepository } from '.';

describe('Order Module', () => {
  it('should be create an order', async () => {
    ProductRepository.prototype.findByNames = jest
      .fn()
      .mockImplementation(() =>
        draftProduct({ name: 'Refrigerante', quantity: 5 }),
      );

    OrderRepository.prototype.store = jest.fn().mockImplementation(
      () =>
        draftOrder({
          products: draftProduct({
            price: '2.00',
            quantity: 10,
          }),
        })[0],
    );

    const orderService = new OrderService();

    const result = await orderService.create(
      draftProduct({ name: 'Refrigerante', quantity: 2 }),
    );

    expect(result.total).toBe('40.00'); // Soma do draftProduct[1] mais o draftProduct[0] modificado (20 + 20)
  });

  it('should be throw an error if quantity ordered is greater than quantity available', async () => {
    try {
      ProductRepository.prototype.findByNames = jest
        .fn()
        .mockImplementation(() =>
          draftProduct({ name: 'Refrigerante', quantity: 2 }),
        );

      const orderService = new OrderService();

      await orderService.create(
        draftProduct({ name: 'Refrigerante', quantity: 5 }),
      );

      expect(OrderRepository.prototype.store).not.toBeCalled();
    } catch (err) {
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe(
        'O produto Refrigerante contém apenas 2 unidade(s) disponível no estoque',
      );
    }
  });
});
