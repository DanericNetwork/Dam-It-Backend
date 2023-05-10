import Websocket from "../socket.dto";
import { joinRoomByPin } from "./room.service";

/**
 * Handles the join room socket.
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class JoinRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(async (pin: string) => {
      joinRoomByPin(this.client, pin);
    });
  }
}
