import { Socket } from "socket.io";

export default class WebSocket {
  private _name: string = "";
  private _execution: Function = () => {};
  private _client: Socket = {} as Socket;

  constructor() {
    this._name = this.constructor.name.toLowerCase();
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
