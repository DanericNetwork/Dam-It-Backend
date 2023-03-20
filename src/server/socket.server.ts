import fs from "fs";
import path from "path";
import { Server as IoServer, Socket } from "socket.io";
import Debug, { DebugMethod } from "../utils/debugger";
import { Config } from "../utils/config";
import Websocket from "../modules/socket.builder";
import { expressServer } from "../server";

export default class SocketServer {
  private io: IoServer;

  constructor() {
    const corsOrigin = Config.frontendUrl;
    this.io = new IoServer(expressServer.http, {
      cors: { origin: corsOrigin },
    });
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket): void {
    const token = socket.handshake.auth.token;
    Debug(DebugMethod.info, `User connected ${token}\n`);
    socket.on("disconnect", () => {
      Debug(DebugMethod.info, "User disconnected\n");
    });
    Debug(DebugMethod.info,  `Loading modules for ${token}...`);
    this.loadModules(socket);
  }

  private loadModules(socket: Socket): void {
    const modulesDir = path.join(__dirname, "../modules");
    const modules = fs.readdirSync(modulesDir);
    modules.forEach((moduleFile) => {
      const modulePath = path.join(modulesDir, moduleFile);
      const stats = fs.lstatSync(modulePath);
      if (stats.isDirectory()) {
        fs.readdirSync(modulePath).forEach((file) => {
          if (file.endsWith(".socket.ts")) {
            this.loadSocketModule(modulePath, file, socket);
          }
        });
      }
    });
  }

  private loadSocketModule(
    modulePath: string,
    file: string,
    socket: Socket
  ): void {
    const module = require(path.join(modulePath, file)).default;
    if (module instanceof Websocket) {
      Debug(DebugMethod.info, `Module ${module.name} initialized`);
      socket.on(module.name, module.function);
    } else {
      Debug(DebugMethod.error, `Initialization of ${file} failed (not a Websocket)`);
    }
  }
}
