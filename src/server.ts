import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";
import { Config } from "./utils/config";

// Initialize the http server and socket server
export const expressServer = new ExpressServer(Config.port);
export const socketServer = new SocketServer(expressServer.app, expressServer.http);	

// Start the server
expressServer.start();