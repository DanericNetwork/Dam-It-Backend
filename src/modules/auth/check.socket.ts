import Debug, { DebugMethod } from "../../utils/debug";
import WebSocket from "../socket.dto";
import { checkValidSession } from "./session.service";

export default class CheckAuth extends WebSocket {
    constructor() {
        super();
        this.setExecution((sessionId: string) => {
            Debug(DebugMethod.info, sessionId)
            checkValidSession(sessionId, this.client);
        });
    }
}