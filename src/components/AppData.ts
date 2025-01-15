import {IProduct, paymentType, IUserData, IOrder, IOrderResult, AppStateModals, IAppState} from "../types";
import {Model} from "./base/Model";

export class AppState extends Model<IAppState> {}

export class ProductItem extends Model<IProduct> {}