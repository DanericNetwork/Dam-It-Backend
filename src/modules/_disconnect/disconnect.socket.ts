import Debug, { DebugMethod } from "../../utils/debug";
import Websocket from "../socket.builder";

export default class Disconnect extends Websocket {
  constructor() {
    super();
    this.setExecution(() => Debug(DebugMethod.warn, `User disconnected ${this.client.id}`));
  }
}
