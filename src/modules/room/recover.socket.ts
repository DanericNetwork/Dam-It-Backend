import Websocket from "../socket.builder";
import { recoverRoomByClient } from "./room.service";

/**
 * This class represents the recover room socket.
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class RecoverRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(async () => {
      recoverRoomByClient(this.client);
    });
  }
}
