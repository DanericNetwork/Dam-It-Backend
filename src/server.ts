import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";

// Initialize the http server and socket server
export const expressServer: ExpressServer = new ExpressServer;
export const socketServer: SocketServer = new SocketServer;	

// Start the servers
expressServer.start();
socketServer.start();
