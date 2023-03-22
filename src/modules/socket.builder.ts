import { Socket } from "socket.io";

export default class WebSocket {
  private _name: string = '';
  private _execution: Function = () => {};
  private _client: any = null;

  constructor() {
    this._name = this.constructor.name.toLowerCase();
  }

  setName(name: string): void {
    this._name = name;
  }

  setExecution(execution: Function): void {
    this._execution = execution;
  }

  setClient(client: Socket): void {
    this._client = client;
  }

  get name(): string {
    return this._name;
  }

  get execution(): any {
    return this._execution;
  }

  get client(): Socket {
    return this._client;
  }
}