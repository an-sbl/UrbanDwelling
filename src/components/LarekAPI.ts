import {IProduct, IOrder, IOrderResult} from "../types";
import { Api } from './base/api';

export interface ILarekAPI {
  getProductList: () => Promise<IProduct[]>; // Получение каталога товаров
  getProductItem: (id: string) => Promise<IProduct>; // Получение описания товара
  orderItems: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа
}

export class LarekAPI extends Api implements ILarekAPI {}