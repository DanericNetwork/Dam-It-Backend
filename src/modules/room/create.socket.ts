import { Socket } from "socket.io";
import Websocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debug";
import { Room } from "./room.service";
import { socketServer } from "../../server";

/**
 * Handles create room requests from the client
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class CreateRoom extends Websocket {
  constructor() {
    super();
    this.setExecution(() => {
      const room: Room = new Room();
      if (this.client.rooms.size > 1) {
        Debug(DebugMethod.error, `${this.client.handshake.auth.userId} tried to create a room while already in a room`);
      } else {
        this.client.join(room.pin.toString());
        this.client.emit("roomCreated", room.pin);
        Debug(DebugMethod.info, `${this.client.handshake.auth.userId} created room with pin: ${room.pin}`);
      }
    });
  }
}
