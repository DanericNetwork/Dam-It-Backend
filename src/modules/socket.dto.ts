import { Socket } from "socket.io";
import { MiddlewareList } from "./middlewares";
import Debug, { DebugMethod } from "../utils/debug";

export default class WebSocket {
  private _name: string = this.constructor.name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .substr(1);
  private _execution: Function = () => {};
  private _middlewares: Function[] = [];
  private _client: Socket = {} as Socket;

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

  setMiddleware(middlewareName: string) {
    if (middlewareName in MiddlewareList) {
      Debug(
        DebugMethod.info,
        `Loading middleware ${middlewareName} for ${this.name}...`
      );
      const middleware = require(`../middlewares/${middlewareName}`).default;
      this._middlewares.push(() => {
        return middleware(this.client);
      });
    }
  }

  get middlewares(): Function[] {
    return this._middlewares;
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
