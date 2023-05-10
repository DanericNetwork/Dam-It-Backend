import WebSocket from "../socket.dto";
import { User } from "./user.service";

export default class LoginAuth extends WebSocket {
    constructor() {
        super();
        this.setExecution((username: string, password: string) => {
            new User(username).login(this.client);
        });
    }
}