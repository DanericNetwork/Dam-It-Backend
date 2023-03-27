import Debug, { DebugMethod } from "../../utils/debug";
import WebSocket from "../socket.builder";
import { leaveRoomByUserId } from "./room.service";

export default class LeaveRoom extends WebSocket {
  constructor() {
    super();
    this.setExecution(() => {
        leaveRoomByUserId(this.client.handshake.auth.userId);
    });
  }
}
