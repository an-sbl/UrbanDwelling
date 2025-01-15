import {Component} from "../base/Component";

interface IModal {
  content: HTMLElement;
}
export class Modal extends Component<IModal> {}