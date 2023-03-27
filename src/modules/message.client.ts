import { Socket } from "socket.io";

export function sendClientError(client: Socket, msg: string) {
  client.emit("error", msg);
}