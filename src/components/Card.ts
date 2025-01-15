import {IProduct} from "../types";
import {Component} from "./base/Component";

interface ICard {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export class Card extends Component<ICard> {}

export class CardPreview extends Component<IProduct> {}