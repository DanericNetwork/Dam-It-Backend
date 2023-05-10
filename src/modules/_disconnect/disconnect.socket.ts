import Debug, { DebugMethod } from "../../utils/debug";
import { Session, getSessionByClient } from "../auth/session.service";
import Websocket from "../socket.dto";

export default class Disconnect extends Websocket {
  constructor() {
    super();
    this.setExecution(() => {
      Debug(DebugMethod.warn, `User disconnected ${this.client.id}`);
      const session: Session | undefined = getSessionByClient(this.client)
      session?.clearClient();
      session?.deactivate();
    });
  }
}
