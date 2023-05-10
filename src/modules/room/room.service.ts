import { randomInt } from "crypto";
import { socketServer } from "../../main";
import { Socket } from "socket.io";
import Debug, { DebugMethod } from "../../utils/debug";
import { Session, getSessionByClient } from "../auth/session.service";
import { LogAction, LogService } from "../log/log.service";

/**
 * Represents a room in the game.
 **/
export class Room {
  private _pin: string;
  private _created_at: Date;
  private _logService: LogService;
  private _player1: Session;
  private _player2?: Session;

  /**
   * @param {Socket} player1 - the first player who joins the room
   * @description
   * Creates a new room instance with a randomly generated pin, logs service and
   * initializes the room for player1.
   */
  constructor(player1: Socket) {
    this._pin = this.generatePin();
    this._player1 = getSessionByClient(player1) as Session;
    this._logService = new LogService(this._pin);
    this._created_at = new Date();
    this.initPlayerRoom(player1);
  }

  /**
   * Generates a 4-digit random pin for the room.
   * @returns {string} The generated pin.
   **/
  private generatePin(): string {
    const pin = randomInt(1000, 9999).toString();
    if (roomStorage.find((room) => room.pin === pin) !== undefined) {
      return this.generatePin();
    } else {
      return pin;
    }
  }

  /**
   * Gets an object representing the players in the room.
   * @returns {any} An object containing the player1 and player2 (if any).
   **/
  get players(): any {
    return {
      player1: this._player1,
      player2: this._player2,
    };
  }

  /**
   * Gets the log service instance for the room.
   * @returns {LogService} The log service instance.
   **/
  get logService(): LogService {
    return this._logService;
  }

  /**
   * Gets the pin for the room.
   * @returns {string} The room pin.
   **/
  get pin(): string {
    return this._pin;
  }

  /**
   * Gets the creation time of the room.
   * @returns {Date} The creation time of the room.
   **/
  get created_at(): Date {
    return this._created_at;
  }

  /**
   * Adds the second player to the room.
   * @param {Socket} player2 - the second player who joins the room
   * @description
   * Sets player2 if not already set, and if the player2 is not the same as player1.
   * Otherwise, sends a client error message.
   **/
  public setPlayer2(player2: Socket): void {
    if (
      this._player2 === undefined &&
      this._player1 !== getSessionByClient(player2) &&
      !findByPlayer(player2)
    ) {
      this._player2 = getSessionByClient(player2);
      player2.join(this._pin);
      player2.emit("roomJoined", this._pin);
    }
  }

  /**
   * Checks if the player is already in a room, if not, joins the player to the room
   * and adds the room to the room storage.
   *  @param {Socket} authorPlayer - the player who created the room
   * **/
  private initPlayerRoom(authorPlayer: Socket): void {
    if (findByPlayer(authorPlayer) !== undefined) {
      Debug(
        DebugMethod.error,
        `${this.players.player1} tried to create a room while already in a room`
      );
    } else {
      authorPlayer.join(this.pin);
      roomStorage.push(this);
      findByPin(this.pin)?.logService.addLog({
        action: LogAction.create,
        player: this.players.player1,
      });
      authorPlayer.emit("roomJoined", this.pin);
      Debug(
        DebugMethod.info,
        `${this.players.player1} created room with pin: ${this.pin}`
      );
    }
  }
}

/** *
 * Finds a room by its pin.
 * @param {string} pin - the pin of the room to find
 * @description Finds the room by the pin.
 */
export function findByPin(pin: string): Room | undefined {
  return roomStorage.find((room) => room.pin === pin);
}

/** *
 * Finds a room by a player.
 * @param {Socket} player - the player to find the room for
 * @description Finds the room by the player id.
 */
export function findByPlayer(player: Socket): Room | undefined {
  return roomStorage.find(
    (room) =>
      room.players.player1 === getSessionByClient(player) ||
      room.players.player2 === getSessionByClient(player)
  );
}

/** *
 * Deletes a room by its pin.
 * @param {string} pin - the pin of the room to delete
 * @description
 * Deletes the room from the room storage and leaves the room for all players.
 */
export async function deleteRoom(pin: string): Promise<void> {
  const room = findByPin(pin);
  if (room !== undefined && room instanceof Room) {
    socketServer.server?.sockets.in(pin).emit("roomLeft");
    socketServer.server?.sockets.in(pin).socketsLeave(pin);
    roomStorage = roomStorage.filter((room) => room.pin !== pin);
  }
}

/**
 * Gets the user id from a socket.
 * @param {Socket} client - the socket to get the user id from
 * @returns {string} The user id.
 **/
export function leaveRoomByUserId(client: Socket): void {
  const userId = getSessionByClient(client);
  const room = client ? findByPlayer(client) : undefined;
  if (room !== undefined) {
    deleteRoom(room.pin);
    Debug(DebugMethod.info, `${userId} disband room with pin: ${room.pin}`);
    client?.emit("roomLeft", room.pin);
  } else {
    Debug(
      DebugMethod.error,
      `${userId} tried to leave a room but was not in one`
    );
  }
}

/**
 * Recovers a room for a client.
 * @param {Socket} client - the client to recover the room for
 * @description
 * Recovers the room for a client if the client is in a room.
 **/
export function recoverRoomByClient(client: Socket): void {
  const room = findByPlayer(client);
  if (room !== undefined) {
    client.join(room.pin);
    client.emit("roomRecovered", room.pin);
    Debug(
      DebugMethod.info,
      `${getSessionByClient(client)} recovered room with pin: ${room.pin}`
    );
    findByPin(room.pin)?.logService.addLog({
      action: LogAction.reconnect,
      player: getSessionByClient(client) === room.players.player1 ? 1 : 2,
    });
  } else {
    client.emit("noRoomRecovered");
  }
}

/**
 * Joins a room by its pin.
 * @param {Socket} client - the client to join the room
 * @param {string} pin - the pin of the room to join
 * @description
 * Joins a room by its pin if the room exists. Otherwise, sends a client error message.
 **/
export function joinRoomByPin(client: Socket, pin: string): void {
  const room = findByPin(pin);
  if (room !== undefined && findByPlayer(client) === undefined) {
    room.setPlayer2(client);
    room.logService.addLog({
      action: LogAction.join,
      player: 1,
    });
  } else {
    Debug(
      DebugMethod.error,
      `${getSessionByClient(client)} tried to join room with pin: ${pin} but it does not exist`
    );
  }
}

/**
 * Emits an event to a room.
 * @param {string} pin - the pin of the room to emit to
 * @param {string} event - the event to emit
 * @param {any} data - the data to emit
 * @description
 * Emits an event to a room if the room exists. Otherwise, sends a client error message.
 **/
export function emitToRoom(pin: string, event: string, data: any): void {
  socketServer.server?.sockets.in(pin).emit(event, data);
}

export let roomStorage: Room[] = [];
