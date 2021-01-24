import { draftProduct } from '@modules/products/__mocks__';
import { IProduct } from '@modules/products';
import { IOrder } from './order.interfaces';

export const draftOrder = (wrap?: Partial<IOrder>): IOrder[] => {
  const products = wrap?.products || draftProduct();
  return [
    {
      id: wrap?.id || (Date.now() + 100).toString(),
      products,
      total: (products as IProduct[])
        .reduce((a, b) => a + +b.price * b.quantity, 0)
        .toFixed(2), // 70.00
    },
  ];
};
