import { debug } from "console";
import { findByPlayer } from "../room/room.service";
import WebSocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debug";


/**
 * This class represents the leave room socket.
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class SendChat extends WebSocket {
  constructor() {
    super();
    this.setExecution((message:string) => {
        findByPlayer(this.client)?.chatService.addMessage(this.client.id, message);
    });
  }
}
