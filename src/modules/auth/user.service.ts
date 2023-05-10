import { Socket } from "socket.io";
import { Session, createSession, getSessionByClient } from "./session.service";
import Debug, { DebugMethod } from "../../utils/debug";
import { socketServer } from "../../main";

export class User {
    private _id: string;
    private _username: string;

    constructor(username: string, id = "test") {
        this._username = username;
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    public login(client: Socket) {
        if(!getSessionByClient(client)) {
            try { 
                const session = createSession(client, false, this);
                session.Client?.emit("authenticated", { sessionId: session.SessionId, user: session.User });
                Debug(DebugMethod.info, `User ${this.username} logged in`);
            } catch (error) {
                Debug(DebugMethod.error, error);
            }
        } else {

            Debug(DebugMethod.error, "Invalid username" + this.username);
        }
    }
}