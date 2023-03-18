import fs from "fs";
import path from "path";
import { Application } from "express";
import { Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";
import Debug from "../modules/debugger";

interface SocketModule {
  name: string;
  function: (socket: Socket, data: any) => void;
}

export default class SocketServer {
  private io: IoServer;

  constructor(private app: Application, private http: HttpServer) {
    const corsOrigin = process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_DOMAIN
      : "http://localhost:8080";
    this.io = new IoServer(this.http, { cors: { origin: corsOrigin } });
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket): void {
    const token = socket.handshake.auth.token;
    Debug(new Date().toLocaleString("en-GB"), `User connected ${token}`);
    socket.on("disconnect", () => {
      Debug("User disconnected");
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

  private loadSocketModule(modulePath: string, file: string, socket: Socket): void {
    const module = require(path.join(modulePath, file)) as SocketModule;
    if (module && module.name && module.function instanceof Function) {
      Debug(`Websocket ${module.name} loaded`);
      socket.on(module.name, module.function);
    } else {
      Debug(`Module ${path.basename(modulePath)} is not a valid module`);
    }
  }
}
