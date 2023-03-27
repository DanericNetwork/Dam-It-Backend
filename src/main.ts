import ExpressServer from "./services/express.service";
import SocketServer from "./services/socket.service";

/** Create the servers **/
export const expressServer: ExpressServer = new ExpressServer();
export const socketServer: SocketServer = new SocketServer();

/** Start the servers **/
expressServer.start();
socketServer.start();
