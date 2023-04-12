import ExpressServer from "./server/express.server";
import SocketServer from "./server/socket.server";
import MongoServer from "./server/mongo.server";

/** Create the servers **/
export const expressServer: ExpressServer = new ExpressServer();
export const socketServer: SocketServer = new SocketServer();
export const mongoServer: MongoServer = new MongoServer();

/** Start the servers **/
expressServer.start();
socketServer.start();
mongoServer.start();
