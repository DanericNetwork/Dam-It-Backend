import { Socket } from "socket.io";
import { emitToRoom } from "../room/room.service";


class ChatMessage {
    private userId: string;
    private message: string;
    private timestamp: Date;

    constructor(userId: string, message: string) {
        this.userId = userId;
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

    public addMessage(userId: string, message: string) {
        this._messages.push(new ChatMessage(userId, message));
        this.refetchMessages();
    }

    private refetchMessages() {
        emitToRoom(this._pin, "messages", this._messages);
    }

    public get messages() {
        return this._messages;
    }
}


