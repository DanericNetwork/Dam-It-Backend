import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";

/** Create the servers **/
export const expressServer: ExpressServer = new ExpressServer();
export const socketServer: SocketServer = new SocketServer();

/** Start the servers **/
expressServer.start();
socketServer.start();
