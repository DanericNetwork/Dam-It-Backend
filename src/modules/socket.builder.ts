export default class Websocket {
  public name: string;
  public function: Function;

  constructor(name: string, func: Function) {
    this.name = name;
    this.function = func;
  }
}
