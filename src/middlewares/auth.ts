import { Socket } from "socket.io";
import { getSessionByClient } from "../modules/auth/session.service";
import Debug, { DebugMethod } from "../utils/debug";

export default function AuthMiddleware(client: Socket) {
    if (!getSessionByClient(client)) {
        client.emit('error', 'You are not logged in');
        Debug(DebugMethod.error, getSessionByClient(client))
        return false;
    } else { 
        return true;
    }
}