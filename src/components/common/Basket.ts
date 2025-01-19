import {Component} from "../base/Component";
import {EventEmitter} from "../base/events";
import {createElement, ensureElement} from "../../utils/utils";


interface IBasket {
  items: HTMLElement[];
  total: number;
}

interface ICardBasket {
  id: string;
  title: string;
price: number;
}
interface ICardBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    // set selected(items: string[]) {
    //     if (items.length) {
    //         this.setDisabled(this._button, false);
    //     } else {
    //         this.setDisabled(this._button, true);
    //     }
    // }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}

export class CardBasket extends Component<ICardBasket> {
  protected _title: HTMLElement;
    protected _price?: HTMLElement;
  protected _index: HTMLElement;
  protected _button?: HTMLButtonElement;

  
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardBasketActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = this.container.querySelector(`.basket__item-delete`);
        this._price = container.querySelector(`.${blockName}__price`);
  
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }
  
    set id(value: string) {
        this.container.dataset.id = value;
    }
  
    get id(): string {
        return this.container.dataset.id || '';
    }
    set title(value: string) {
        this.setText(this._title, value);
    }
  
    set price(value: string) {
      this.setText(this._price, value + " синапсов");
  }
  
    set index(value: string) {
    this.setText(this._index, value);
}
}
