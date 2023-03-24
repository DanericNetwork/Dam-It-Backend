import WebSocket from "../socket.builder";

export default class LeaveRoom extends WebSocket {
    constructor() {
        super();
        this.setExecution(() => {
            this.client.leave(this.client.rooms.values().next().value);
            this.client.emit("roomLeft");
        });
    }
}