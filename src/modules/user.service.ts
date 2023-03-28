import { Socket } from "socket.io";
import Debug, { DebugMethod } from "../utils/debug";
import { socketServer } from "../main";

/**
 * Gets the user id from the client socket.
 * @param {Socket} client - the client socket
 * @returns {string} The user id.
 * @description
 * This function is used to get the user id from the client socket.
 * This is used to identify the user.
 **/
export function getUserId(client: Socket): string {
  return client.handshake.auth.userId;
}

/**
 * Gets the client socket by the user id.
 * @param {string} userId - the user id to search for
 * @returns {Socket} The client socket.
 * @description
 * This function is used to get the client socket by the user id.
 * This is used to send messages to the client.
 * @example
 * getClientByUserId("1234567890").emit("message", "Hello World");
 **/
export function getClientByUserId(userId: string): Socket | undefined {
  const sockets = Array.from(
    socketServer.server?.sockets.sockets.values() as Iterable<Socket>
  );

  const client = sockets.find((socket: Socket) => {
    return socket.handshake.auth.userId === userId;
  });

  if (client) {
    return client;
  } else {
    Debug(DebugMethod.error, `User ${userId} not found`);
    return undefined;
  }
}




