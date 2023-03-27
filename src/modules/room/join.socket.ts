import Websocket from "../socket.builder";
import { findByPin, findByPlayer, joinRoomByPin } from "./room.service";

/**
 * Handles create room requests from the client
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
