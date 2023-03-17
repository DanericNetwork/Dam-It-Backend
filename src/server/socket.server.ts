import { Server as IoServer } from "socket.io";
import { Application } from "express";
import { Server as HttpServer } from "http";
import fs from "fs";
import path from "path";
import Websocket from "../modules/socket.builder";
import Debug from "../modules/debugger";

export default class SocketServer {
  public io: IoServer;

  constructor(private app: Application, private http: HttpServer) {
    this.io = require("socket.io")(this.http, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.FRONTEND_DOMAIN
            : "http://localhost:8080",
      },
    });
    this.io.on("connection", this.onConnection.bind(this));
  }

  private onConnection(socket: any): void {
    let token = socket.handshake.auth.token;
    Debug((new Date()).toLocaleString('en-GB'), "User connected " + token);
    socket.on("disconnect", () => {
      Debug("user disconnected");
    });
    this.loadModules(socket);
  }

  private loadModules(socket: any): void {
    const modules = fs.readdirSync(path.join(__dirname, '../modules'));
    modules.forEach((folder: any) => {
      const modulePath = path.join(__dirname, '../modules', folder);
      if (fs.lstatSync(modulePath).isDirectory()) {
        fs.readdirSync(modulePath).forEach((file: any) => {
          if (file.includes(".socket.ts")) {
            this.loadSocketModule(modulePath, file, socket);
          }
        });
      }
    });
  }

  private loadSocketModule(modulePath: string, file: string, socket: any): void {
    const module = require(path.join(modulePath, file));
    if (module.default instanceof Websocket) {
      Debug(
        "\x1b[31m%s\x1b[0m",
        "Websocket \x1b[32m" + module.default?.name + "\x1b[31m loaded"
      );
      socket.on(module.default.name, module.default.function);
    } else {
      Debug(
        "\x1b[31m%s\x1b[0m",
        "Module " + path.basename(modulePath) + " is not a valid module"
      );
    }
  }
}
