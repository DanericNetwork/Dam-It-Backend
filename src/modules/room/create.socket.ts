import { Socket } from "socket.io";
import Websocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debug";
import { Room } from "./room.service";
import { socketServer } from "../../server";

/**
 * Handles create room requests from the client
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class CreateRoomSocket extends Websocket {
  constructor(socket: Socket) {
    super("createRoom", () => {
      const room: Room = new Room();
      Debug(DebugMethod.info, `Created room with pin: ${room.pin}`);

      socket.join(room.pin.toString());
      socketServer.io?.to(room.pin.toString()).emit("roomCreated", room);
    });
  }
}
