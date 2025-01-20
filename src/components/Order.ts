import {IUserData} from "../types";
import {Form} from "./common/Form";
import { IEvents} from "./base/events";
import { ensureAllElements } from "../utils/utils";

export class Delivery extends Form<IUserData> {

  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        //this.payment = button.name; 
        events.emit('payment:set', button)
      });
  })
}

set payment(value: string) {
  this._buttons.forEach(button => {
    this.toggleClass(button, 'button_alt-active', button.name === value);
  });
}

set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
}
}
export class Contacts extends Form<IUserData> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
}

set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}

set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
}
}