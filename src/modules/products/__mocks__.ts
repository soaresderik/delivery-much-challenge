import { IProduct } from './product.interface';

export const draftProduct = (wrap?: Partial<IProduct>): IProduct[] => {
  return [
    {
      id: wrap?.id || (Date.now() + 100).toString(),
      name: wrap?.name || 'Fake Name #1',
      price: wrap?.price || '5.00',
      quantity: wrap?.quantity || wrap?.quantity === 0 ? wrap?.quantity : 10,
    },
    {
      id: Date.now().toString(),
      name: 'Fake Name #2',
      price: '2.00',
      quantity: 10,
    },
  ];
};
