import {Component} from "../base/Component";

interface IForm {
  valid: boolean;
  errors: string[];
}
export class Form<T> extends Component<IForm> {}