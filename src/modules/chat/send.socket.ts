import { debug } from "console";
import { findByPlayer } from "../room/room.service";
import WebSocket from "../socket.dto";
import Debug, { DebugMethod } from "../../utils/debug";
import { getSessionByClient } from "../auth/session.service";


/**
 * This class represents the leave room socket.
 * @param {Socket} socket this represents the client socket. (for info as socketID e.g)
 **/
export default class SendChat extends WebSocket {
  constructor() {
    super();
    this.setExecution((message:string) => {
        findByPlayer(this.client)?.chatService.addMessage(getSessionByClient(this.client)?.User.username, message);
        console.log(message);
    });
  }
}
