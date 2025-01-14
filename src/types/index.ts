// Типизация данных

interface IProduct {
  id: string;
	description: string;
  image: string;
  title: string;
	category: string;
	price: number;
}

type paymentType = "online" | "offline";

interface IUserData {
  payment?: paymentType;
  address?: string;
  email?: string;
  phone?: string;
}

interface IOrder extends IUserData {
	items: IProduct[];
}

export interface IOrderResult {
	id: string;
}

// Перечисление модальных окон
export enum AppStateModals {
	item = 'modal:item',
	basket = 'modal:basket',
  delivery = 'modal:delivery',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}

// Тип данных для модели данных - состояния приложения
export interface IAppState {
  catalog: IProduct[]; 
  preview: string | null;
  basket: string[]; 
  basketTotal: number; 
  order: IOrder | null;
  validationError: string | null;
}


