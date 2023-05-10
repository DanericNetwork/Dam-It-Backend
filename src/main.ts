import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";
import MongoServer from "./server/mongo.server";

/** Create the servers **/
export const mongoServer: MongoServer = new MongoServer();
export const expressServer: ExpressServer = new ExpressServer();
export const socketServer: SocketServer = new SocketServer();

/** Start the servers **/
mongoServer.start();
expressServer.start();
socketServer.start();
