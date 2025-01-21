import {IProduct, IUserData, IOrderResult} from "../types";
import {Api, ApiListResponse} from './base/api';

interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>; // Получение каталога товаров
    getProductItem: (id: string) => Promise<IProduct>; // Получение описания товара
    orderItems: (order: IOrderAPI) => Promise<IOrderResult>; // Оформление заказа
}

interface IOrderAPI extends IUserData {
	items: string[];
    total: number;
}
export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
    );
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    orderItems(order: IOrderAPI): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}