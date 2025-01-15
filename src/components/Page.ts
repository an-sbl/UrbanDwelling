import {Component} from "./base/Component";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}
export class Page extends Component<IPage> {}