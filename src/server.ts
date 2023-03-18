import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";
import dotenv from "dotenv";

// Initialize the http server and socket server
export const expressServer = new ExpressServer(3000);
export const socketServer = new SocketServer(expressServer.app, expressServer.http);	

// Start the server
expressServer.start();