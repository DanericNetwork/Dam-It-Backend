/**
 * Builds an websocket for socket.ts files.
 * @param {string} name represents the socket ($io.emit("name"))
 * @param {any} function executed when socket is emitted (with parameters)
 * @example new Websocket("test", () => { console.log("this is a test") }) 
 */
export default class Websocket {
  public name: string;
  public function: any;

  constructor(name: string, func: any) {
    this.name = name;
    this.function = func;
  }
}
