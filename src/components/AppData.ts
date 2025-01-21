import _ from "lodash";

import {IProduct, IUserData, IOrder, IAppState} from "../types";
import {Model} from "./base/Model";

export type CatalogChangeEvent = {
  catalog: ProductItem[]
};

export class AppState extends Model<IAppState> {
  catalog: ProductItem[];
  order: IOrder = {
    payment : null,
    address: '',
    email: '',
    phone: '',
    items: []
  };
  preview: string | null;

  setCatalog(items: IProduct[]) {

    this.catalog = items.map(item => {
      item.price = (item.price === null)? 0:item.price;
      return new ProductItem(item, this.events);
    });
    this.emitChanges('items:changed', { catalog: this.catalog });
}

  setPreview(item: IProduct) {
    this.preview = item.id;
    const isInBasket = this.order.items.indexOf(item) === -1 // true - элекмента нет в корзине
    this.emitChanges('preview:changed', {item, isInBasket});
  }

  addCardToOrder(item:ProductItem){
    this.order.items.push(item);
    this.emitChanges('basket:changed');
  }

  deleteCardFromOrder(item:ProductItem){
    const orderItems = this.order.items.filter((itemOrder) => itemOrder !== item);
    this.order.items = orderItems;
    this.emitChanges('basket:changed');
  }

  clearBasket(){
    this.order = {
      payment: null,
      address: "",
      email:"",
      phone:"",
      items: []
    }
  }

  getTotal() {
    return Number(this.order.items.reduce((a, c) => a + c.price, 0));
  }

  getOrderItemsId(){
    return this.order.items.filter(item => item.price != 0).map((item) => item.id);
  }

  setInputField(field: keyof IUserData, value: string) {
    this.order[field] = value;
    if (field === 'payment'){
      this.events.emit('payment:changed');
    }
    if (field === 'address' || field === 'payment'){
      console.log(field);
      if (this.validateDelivery()) {
        this.events.emit('delivery:ready');
      }
    }
    if (field === 'phone' || field ===  'email'){
      console.log(field);

      if (this.validateContacts()) {
        this.events.emit('contacts:ready');
      }
    }
    
  }

  validateDelivery() {
  const errors: Partial<IUserData> = {}
        if (!this.order.address) {
          errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
          errors.payment = 'Необходимо указать способ оплаты';
        }
        if(errors){
          this.events.emit('formErrors:change', errors);
        }
        return Object.keys(errors).length === 0;
    }
    
  validateContacts(){
    const errors: Partial<IUserData> = {}
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if(errors){
      this.events.emit('formErrors:change', errors);
    }
    return Object.keys(errors).length === 0;
  }
}

export class ProductItem extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}