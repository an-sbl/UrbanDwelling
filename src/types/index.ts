// Типизация данных

export interface IProduct {
  id: string;
	description: string;
  image: string;
  title: string;
	category: string;
	price: number | null;
}

export type paymentType = "online" | "offline";

export interface IUserData {
  payment?: paymentType | null;
  address?: string;
  email?: string;
  phone?: string;
}

export interface IOrder extends IUserData {
	items: IProduct[];
}

export interface IOrderResult {
	id: string;
}

export enum AppStateModals {
	item = 'modal:item',
	basket = 'modal:basket',
  delivery = 'modal:delivery',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}

export interface IAppState {
  catalog: IProduct[]; 
  preview: string | null;
  // basketTotal: number; 
  order: IOrder | null;
  validationError: string | null;
}


