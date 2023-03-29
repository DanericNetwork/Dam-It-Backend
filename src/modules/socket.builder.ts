import { Socket } from "socket.io";

export default class WebSocket {
  private _name: string = this.constructor.name.replace(/([A-Z])/g, "-$1").toLowerCase().substr(1);
  private _execution: Function = () => {};
  private _client: Socket = {} as Socket;
  protected executionHandler: Function | any = () => {}

  constructor() {
    this.setExecution(this.executionHandler);
  }

  public setExecutionHandler(handler: Function) {
    this.executionHandler = handler;
  }

  /**
   * Sets the name of the socket
   **/
  setName(name: string): void {
    this._name = name;
  }

  /**
   *  Sets the function to be executed when the socket is called
   * @param {Function} execution The function to be executed when the socket is called
   **/
  setExecution(execution: Function | any): void {
    this._execution = execution;
  }

  /**
   * Sets the client of the socket
   * @param {Socket} client The client of the socket
   **/
  setClient(client: Socket): void {
    this._client = client;
  }

  /**
   * Get the name of the socket
   * If not set, it will return the name of the class (e.g. CreateRoom -> create-room)
   **/
  get name(): string {
    return this._name;
  }

  /**
   * Get the function to be executed when the socket is called
   **/
  get execution(): Function | any {
    return this._execution;
  }

  /**
   * Get the client of the socket
  **/
  get client(): Socket {
    return this._client;
  }
}
