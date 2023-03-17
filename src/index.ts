import ExpressServer from "./modules/server/express.server";
import Websocket from "./modules/socket.builder";
import SocketServer from "./modules/server/socket.server";
import fs from "fs";

export const expressServer = new ExpressServer(3000);
export const socketServer = new SocketServer(expressServer.app, expressServer.http);	


// socketServer.io.on("connection", (socket: any) => {
//   let token = socket.handshake.auth.token;
//   console.log("a user connected " + token);
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("my message", (msg: any) => {
//     socketServer.io.emit("my broadcast", `server: ${msg}`);
//   });

//   socket.on("join", (roomName: any) => {
//     console.log("join: " + roomName);
//     socket.join(roomName);
//   });

//   socket.on("message", (message: any, roomName: any) => {
//     console.log("message" + message + " in " + roomName);
//     socket.to(roomName).emit("message", message);
//     socket.emit("message", "ok");
//   });
// });
const modules = fs.readdirSync(__dirname + "/modules");

console.log("\nLoading websockets \n------------------------");
modules.forEach((folder: any) => {
  const modulePath = __dirname + "/modules/" + folder;
  if (fs.lstatSync(modulePath).isDirectory()) {
    fs.readdirSync(modulePath).forEach((file: any) => {
      if (file.includes(".socket.ts")) {
        const socket = require(modulePath + "/" + file);

        if (socket.default instanceof Websocket) {
          console.log("\x1b[31m%s\x1b[0m", "Websocket \x1b[32m" + socket.default?.name + "\x1b[31m loaded");
          socketServer.io.on(socket.default.name, socket.default.function);
        } else {
          console.log("\x1b[31m%s\x1b[0m", "Module " + folder + " is not a valid module");
        }
      }
    });
  }
});

      


socketServer.init();
expressServer.start();