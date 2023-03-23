import { randomInt } from "crypto";

export class Room {
  private _pin: number;
  private _created_at: Date;

  constructor() {
    this._pin = randomInt(100000, 999999);
    this._created_at = new Date();
  }

  get pin(): number {
    return this._pin;
  }

  get created_at(): Date {
    return this._created_at;
  }
}
