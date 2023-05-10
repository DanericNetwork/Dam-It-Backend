import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { User } from "./user.service";

export class Session {
  private sessionId: string;
  private createdAt: Date;
  private isGuest: boolean;
  private client?: Socket | undefined;
  private lastActive: Date;
  private user?: User;
  static lastUpdate = new Date();

  constructor(isGuest: boolean, client?: Socket, user?: any) {
    this.client = client;
    this.sessionId = randomUUID();
    this.createdAt = new Date();
    this.isGuest = isGuest;
    this.lastActive = new Date();
    this.user = user;
  }

  static updateLastUpdate() {
    this.lastUpdate = new Date();
  }

  get SessionId(): string {
    return this.sessionId;
  }

  get CreatedAt(): Date {
    return this.createdAt;
  }

  get LastUpdate(): Date {
    return Session.lastUpdate;
  }

  get IsGuest(): boolean {
    return this.isGuest;
  }

  get User(): any {
    return this.user;
  }

  get Client(): Socket | undefined {
    return this.client;
  }

  get LastActive(): Date {
    return this.LastActive;
  }

  set Client(client: Socket | undefined) {
    this.client = client;
  }

  activate(): Date {
    return this.lastActive = new Date;
  }

  deactivate(): Date {
    return this.lastActive = new Date;
  }

  clearClient(): void {
    this.client = undefined;
  }
}

export function updateClientBySessionId(sessionId: string, client: Socket) {
  const session = getSession(sessionId);
  if (session !== undefined) {
    session.Client = client;
    client.emit("auth", true);
  } else {
    client.emit("auth", false);
  }
}


export function getSession(sessionId: string): Session | undefined {
  return sessionStorage.find((session) => session.SessionId === sessionId);
}

export function getSessionByClient(client: Socket): Session | undefined {
  return sessionStorage.find((session) => session.Client?.id === client.id);
}

export function findClientBySession(sessionId: string): Socket | undefined {
  return sessionStorage.find((session) => session.SessionId === sessionId)
    ?.Client;
}

export function checkValidSession(sessionId: string, client: Socket): void {
  const session = getSession(sessionId);
  if (session !== undefined) {
    if (session.Client?.id !== client.id) {
      session.Client = client;
    }
    client.emit("auth", true);
  } else {
    client.emit("auth", false);
  }
}

export function createSession(
  client: Socket,
  isGuest: boolean,
  user?: User
): Session {
  if (getSession(client.handshake.auth.sessionId) !== undefined) {
    throw new Error("Session already exists");
  } else {
    const session = new Session(isGuest, client, user);
    sessionStorage.push(session);
    return session;
  }
}

let sessionStorage: Session[] = [];
