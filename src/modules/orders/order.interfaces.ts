import { IProduct } from '@modules/products';

export interface IOrderDTO {
  name: string;
  quantity: number;
}

export interface IOrder {
  id: string;
  products: IProduct[] | string;
  total: string;
}
