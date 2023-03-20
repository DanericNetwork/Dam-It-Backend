import { Socket } from "socket.io";
import Websocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debug";

/*
 * Handles client's who disconnect from the socketserver
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 */
export default class DisconnectSocket extends Websocket {
  constructor(socket: Socket) {
    super("disconnect", () => {
      Debug(DebugMethod.warn, `User disconnected! ${socket.id}`);
    });
  }
}
