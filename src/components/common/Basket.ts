import {Component} from "../base/Component";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {}

interface ICardBasket {
  id: string;
  title: string;
price: number;
}

export class CardBasket extends Component<ICardBasket> {}