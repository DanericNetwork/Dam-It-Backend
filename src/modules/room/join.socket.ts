import { Socket } from "socket.io";
import Websocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debug";
import { Room } from "./room.service";
import { socketServer } from "../../server";

/**
 * Handles create room requests from the client
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class JoinRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(async (pin: number) => {
      this.client.join(pin.toString());
        Debug(DebugMethod.info, `${this.client.handshake.auth.userId} joined room with pin: ${pin}`);
    });
  }
}
