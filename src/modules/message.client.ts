import { Socket } from "socket.io";

/** *
 * Sends a client error message.
 * @param {Socket} client - the client to send the error message to
 * @param {string} msg - the error message to send
 **/
export function sendClientError(client: Socket, msg: string) {
  client.emit("error", msg);
}
