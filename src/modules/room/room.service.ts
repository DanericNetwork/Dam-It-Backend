import { randomInt } from "crypto";
import { socketServer } from "../../main";
import { Socket } from "socket.io";
import Debug, { DebugMethod } from "../../utils/debug";

export let roomStorage: Room[] = [];

export class Room {
  private _pin: string;
  private _created_at: Date;
  private _chat: any[] = [];
  private _game: any = {};
  private _player1: string;
  private _player2?: string;

  constructor(player1: Socket) {
    this._pin = this.generatePin();
    this._player1 = player1.handshake.auth.userId;
    this._created_at = new Date();
    this.initPlayerRoom(player1);
  }

  private generatePin(): string {
    const pin = randomInt(1000, 9999).toString();
    if (socketServer.server?.sockets.adapter.rooms.has(pin)) {
      return this.generatePin();
    } else {
      return pin;
    }
  }

  get players(): any {
    return {
      player1: this._player1,
      player2: this._player2,
    };
  }

  get pin(): string {
    return this._pin;
  }

  get created_at(): Date {
    return this._created_at;
  }

  public setPlayer2(player2: Socket): void {
    if (this._player2 === undefined && this._player1 !== getUserId(player2)) {
      this._player2 = getUserId(player2);
      player2.join(this._pin);
      player2.emit("roomJoined", this._pin);
    }
  }

  private initPlayerRoom(authorPlayer: Socket): void {
    if (findByPlayer(authorPlayer) !== undefined) {
      Debug(
        DebugMethod.error,
        `${this.players.player1} tried to create a room while already in a room`
      );
    } else {
      authorPlayer.join(this.pin);
      authorPlayer.emit("roomCreated", this.pin);
      authorPlayer.emit("roomJoined", this.pin);
      roomStorage.push(this);
      Debug(
        DebugMethod.info,
        `${this.players.player1} created room with pin: ${this.pin}`
      );
    }
  }
}

export function findByPin(pin: string): Room | undefined {
  return roomStorage.find((room) => room.pin === pin);
}

export function findByPlayer(player: Socket): Room | undefined {
  return roomStorage.find(
    (room) =>
      room.players.player1 === getUserId(player) ||
      room.players.player2 === getUserId(player)
  );
}

export async function deleteRoom(pin: string): Promise<void> {
  const room = findByPin(pin);
  if (room !== undefined && room instanceof Room) {
    socketServer.server?.sockets.in(pin).emit("roomLeft");
    Debug(DebugMethod.info, `Room ${pin} deleted`);
  }
}

export function getUserId(client: Socket): string {
  return client.handshake.auth.userId;
}

export function getClientByUserId(userId: string): Socket | void {
  let client: any;
  socketServer.server?.sockets.sockets.forEach((socket: Socket) => {
    if (socket?.handshake.auth.userId == userId) {
      client = socket;
    }
  });
  if (client instanceof Socket) {
    return client;
  } else {
    Debug(DebugMethod.error, `User ${userId} not found`);
  }
}

export function leaveRoomByUserId(userId: string): void {
  const client = getClientByUserId(userId);
  const room = client ? findByPlayer(client) : undefined;
  if (room !== undefined) {
    deleteRoom(room.pin);
    Debug(
      DebugMethod.info,
      `${userId} left & deleted room with pin: ${room.pin}`
    );
    client?.emit("roomLeft", room.pin);
  }
}
