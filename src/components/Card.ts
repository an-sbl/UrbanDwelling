import {IProduct} from "../types";
import {Component} from "./base/Component";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICard {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _price?: HTMLElement;
  protected _category?: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);
      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._button = container.querySelector(`gallery__item`);
      this._price = container.querySelector(`.${blockName}__price`);
      this._category = container.querySelector(`.${blockName}__category`);

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

  set category(value: string) {
    this.setText(this._category, value);
}

    get category(): string {
    return this._category.textContent || '';
}
  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set image(value: string) {
      this.setImage(this._image, value, this.title)
  }
  
  set price(value: string) {
    this.setText(this._price, value + " синапсов");
}
}

export class CardPreview extends Component<IProduct> {
    protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _price?: HTMLElement;
  protected _category?: HTMLElement;
  protected _button: HTMLButtonElement;


    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._price = container.querySelector(`.${blockName}__price`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._button = container.querySelector(`.${blockName}__button`);
        

        this._button.addEventListener('click', actions.onClick);
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
  
    get title(): string {
        return this._title.textContent || '';
    }
  
    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
    set description(value: string) {
        this.setText(this._description, value);
    }
  
    get description(): string {
        return this._description.textContent || '';
    }
    set category(value: string) {
        this.setText(this._category, value);
    }
  
    get category(): string {
        return this._category.textContent || '';
    }
    set price(value: string) {
        this.setText(this._price, value + " синапсов");
    }
  
    get price(): string {
        return this._price.textContent || '';
    }
    
}