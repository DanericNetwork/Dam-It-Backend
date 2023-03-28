import WebSocket from "../socket.builder";
import { leaveRoomByUserId } from "./room.service";

/**
 * This class represents the leave room socket.
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class LeaveRoom extends WebSocket {
  constructor() {
    super();
    this.setExecution(() => {
        leaveRoomByUserId(this.client);
    });
  }
}
