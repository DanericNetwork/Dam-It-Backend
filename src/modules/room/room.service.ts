import { randomInt } from "crypto";

export class Room {
    pin: number;
    author: string;
    created_at: Date;

    constructor(author: string) {
        this.pin =  randomInt(100000, 999999);
        this.author = author;
        this.created_at = new Date();
    }
}