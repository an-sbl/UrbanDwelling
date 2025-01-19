import {IUserData} from "../types";
import {Form} from "./common/Form";
import { IEvents} from "./base/events";

export class Delivery extends Form<IUserData> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
}

set phone(value: string) {
    (this.container.elements.namedItem('card') as HTMLInputElement).value = value;
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