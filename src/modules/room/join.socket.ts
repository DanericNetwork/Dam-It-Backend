import Websocket from "../socket.builder";
import { findByPin, findByPlayer } from "./room.service";

/**
 * Handles create room requests from the client
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class JoinRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(async (pin: string) => {
      const room = findByPin(pin);
      if (room !== undefined) {
        findByPlayer(this.client) === undefined ? room.setPlayer2(this.client) : null;
      } else {
        this.client.emit("roomNotFound");
      }
    });
  }
}
