import { emitToRoom } from "../room/room.service";

/**
 * Enum for the different log actions.
 * @enum {string}
 * @property {string} join - The player joined the room.
 * @property {string} create - The player created the room.
 * @property {string} end - The game ended.
 * @property {string} disconnect - The player disconnected.
 * @property {string} reconnect - The player reconnected.
 **/
export enum LogAction {
  join = "join",
  create = "create",
  end = "end",
  disconnect = "disconnect",
  reconnect = "reconnect",
}

/**
 * Represents enum for the different log data.
 * @enum {string}
 * @property {string} pin - The pin of the room.
 * @property {string} from - The from position.
 * @property {string} to - The to position.
 **/
interface LogData {
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  pin?: string;
}

/**
 * Represents a log entry input.
 * @interface
 * @property {LogAction} action - The action that was performed.
 * @property {string} player - The player that performed the action.
 * @property {object} data - The data for the action.
 * @property {object} from - The from position for the action.
 * @property {object} to - The to position for the action.
 **/
interface LogEntry {
  action: LogAction;
  player: string;
  data?: object;
  from?: { x: number; y: number };
  to?: { x: number; y: number };
}

/**
 * This class creates a new set of data for log.
 * @class
 * @property {LogAction} action - The action that was performed.
 * @property {string} player - The player that performed the action.
 * @property {object} data - The data for the action.
 * @property {Date} timestamp - The timestamp of the log entry.
 **/
class Log {
  private action: LogAction;
  private player: string;
  private data?: LogData;
  private timestamp: Date;

  constructor(action: LogAction, player: string, data?: LogData) {
    this.action = action;
    this.player = player;
    this.data = data;
    this.timestamp = new Date();
  }

  public get move(): {
    from: { x: number; y: number };
    to: { x: number; y: number };
  } {
    if (this.data?.from && this.data?.to) {
      return {
        from: this.data.from,
        to: this.data.to,
      };
    } else {
      throw new Error("This log entry has no move data");
    }
  }
}

/**
 * This class represents the log service.
 * @description This class is used to store the logs for a room.
 * @class
 * @property {string} roomPin - The pin of the room.
 * @property {Log[]} logs - The logs for the room.
 *
 * @method refetchLogs - Emits the logs to the room.
 * @method storeLog - Stores the log in the logs array.
 * @method addLog - Adds a log to the logs array and emits the logs to the room.
 **/
export class LogService {
  private _logs: Log[] = [];
  private _roomPin: string;

  constructor(roomPin: string) {
    this._roomPin = roomPin;
  }

  private get roomPin(): string {
    return this._roomPin;
  }

  public get logs(): Log[] {
    return this._logs;
  }

  /**
   * Emits the logs to the room.
   * @description It emits the whole logs array to the room.
   **/
  public refetchLogs(): void {
    emitToRoom(this.roomPin, "logs", this._logs);
  }

  /**
   * Stores the log in the logs array.
   * @description It creates a new log object and pushes it to the logs array.
   **/
  private storeLog(entry: LogEntry): void {
    this._logs.push(new Log(entry.action, entry.player, entry.data));
  }

  /**
   * Creates a new log and refetches the logs.
  **/
  public addLog(entry: LogEntry): void {
    this.storeLog(entry);
    this.refetchLogs();
  }
}
