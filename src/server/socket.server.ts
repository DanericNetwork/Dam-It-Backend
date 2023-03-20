import fs from "fs";
import path from "path";
import { Application } from "express";
import { Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";
import Debug, { DebugMethod } from "../utils/debugger";
import { Config } from "../utils/config";
import Websocket from "../modules/socket.builder";

export default class SocketServer {
  private io: IoServer;

  constructor(private app: Application, private http: HttpServer) {
    const corsOrigin =
      Config.env === "production"
        ? Config.frontendUrl
        : "http://localhost:8080";
    this.io = new IoServer(this.http, { cors: { origin: corsOrigin } });
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket): void {
    const token = socket.handshake.auth.token;
    Debug(DebugMethod.info, `User connected ${token}`);
    socket.on("disconnect", () => {
      Debug(DebugMethod.info, "User disconnected");
    });
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
      Debug(DebugMethod.info, `Websocket ${module.name} loaded`);
      socket.on(module.name, module.function);
    } else {
      Debug(DebugMethod.error, `Websocket ${file} not loaded`);
    }
  }
}
