import { Socket } from "socket.io";
import Websocket from "../socket.builder";
import Debug, { DebugMethod } from "../../utils/debugger";
  
export default class DisconnectSocket extends Websocket {
  constructor(socket: Socket) {
    super("disconnect", () => { Debug(DebugMethod.warn, `User disconnected! ${socket.id}`) }); 
  }
}