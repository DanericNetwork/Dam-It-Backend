import Websocket from "../socket.dto";
import { Room } from "./room.service";

/**
 * Handles create room requests from the client
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class CreateRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(() => {
      new Room(this.client);
    });
  }
}
