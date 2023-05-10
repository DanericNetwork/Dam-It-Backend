import { Socket } from "socket.io";
import { emitToRoom } from "../room/room.service";


class ChatMessage {
    private username: string;
    private message: string;
    private timestamp: Date;

    constructor(username: string, message: string) {
        this.username = username;
        this.message = message;
        this.timestamp = new Date();
    }
}

export class ChatService {
    private _messages: ChatMessage[] = [];
    private _pin: string;

    constructor(pin: string) {
        this._pin = pin;
    }

    public addMessage(username: string, message: string) {
        this._messages.push(new ChatMessage(username, message));
        this.refetchMessages();
    }

    private refetchMessages() {
        emitToRoom(this._pin, "messages", this._messages);
    }

    public get messages() {
        return this._messages;
    }
}


