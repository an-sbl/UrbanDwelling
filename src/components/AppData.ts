import _ from "lodash";

import {IProduct, IUserData, IOrder, IOrderResult, AppStateModals, IAppState} from "../types";
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
  formErrors: Partial<Record<keyof IOrder, string>> = {}

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


setPayment(value:string){
  this.order.payment = value;
  this.events.emit('payment:changed');
}

setOrderField(field: keyof IUserData, value: string) {
  this.order[field] = value;
  if (field === 'address'){
   // if (this.validateDelivery()) {
      this.events.emit('delivery:ready');
   // }
  }
  if (field === 'phone'){
   // if (this.validateContacts()) {
      this.events.emit('contacts:ready');
    //}
  }
  
}
//   setPayment(payment) {
//     this.order[field] = value;

//      if (this.validateOrder()) {
//          this.events.emit('order:ready', this.order);
//      }
// }

validateDelivery() {
       const errors: typeof this.formErrors = {};
       if (!this.order.address) {
        errors.phone = 'Необходимо указать адрес';
      }
      if (!this.order.payment) {
        errors.payment = 'Необходимо указать способ оплаты';
      }
       this.formErrors = errors;

       this.events.emit('formErrors:change', this.formErrors);
       this.events.emit('validation:ready', this.order);
       return Object.keys(errors).length === 0;
   }

validateContacts(){
  const errors: typeof this.formErrors = {};
  if (!this.order.email) {
      errors.email = 'Необходимо указать email';
   }
   if (!this.order.phone) {
     errors.phone = 'Необходимо указать телефон';
   }
   this.formErrors = errors;
   this.events.emit('formErrors:change', this.formErrors);
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
    // about: string;
    // description: string;
    // id: string;
    // image: string;
    // title: string;
    // datetime: string;
    // history: number[];
    // minPrice: number;
    // price: number;
    // status: LotStatus;

    // protected myLastBid: number = 0;

    // clearBid() {
    //     this.myLastBid = 0;
    // }

    // placeBid(price: number): void {
    //     this.price = price;
    //     this.history = [...this.history.slice(1), price];
    //     this.myLastBid = price;

    //     if (price > (this.minPrice * 10)) {
    //         this.status = 'closed';
    //     }
    //     this.emitChanges('auction:changed', { id: this.id, price });
    // }

    // get isMyBid(): boolean {
    //     return this.myLastBid === this.price;
    // }

    // get isParticipate(): boolean {
    //     return this.myLastBid !== 0;
    // }

    // get statusLabel(): string {
    //     switch (this.status) {
    //         case "active":
    //             return `Открыто до ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
    //         case "closed":
    //             return `Закрыто ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
    //         case "wait":
    //             return `Откроется ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
    //         default:
    //             return this.status;
    //     }
    // }

    // get timeStatus(): string {
    //     if (this.status === 'closed') return 'Аукцион завершен';
    //     else return dayjs
    //         .duration(dayjs(this.datetime).valueOf() - Date.now())
    //         .format('D[д] H[ч] m[ мин] s[ сек]');
    // }

    // get auctionStatus(): string {
    //     switch (this.status) {
    //         case 'closed':
    //             return `Продано за ${formatNumber(this.price)}₽`;
    //         case 'wait':
    //             return 'До начала аукциона';
    //         case 'active':
    //             return 'До закрытия лота';
    //         default:
    //             return '';
    //     }
    // }

    // get nextBid(): number {
    //     return Math.floor(this.price * 1.1);
    // }
}