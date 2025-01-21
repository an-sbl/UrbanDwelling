// Типизация данных
export interface IProduct {
  id: string;
	description: string;
  image: string;
  title: string;
	category: string;
	price: number | null;
  valid?:boolean
}


export interface IUserData {
  payment?: string | null;
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


export interface IAppState {
  catalog: IProduct[]; 
  preview: string | null; 
  order: IOrder | null;
}


