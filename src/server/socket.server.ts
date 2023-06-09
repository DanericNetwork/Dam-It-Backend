import fs from "fs";
import path from "path";
import { Server as IoServer, Socket } from "socket.io";
import Debug, { DebugMethod } from "../utils/debug";
import { Config } from "../utils/config";
import Websocket from "../modules/socket.builder";
import { expressServer, socketServer } from "../server";

/**
 * Manages the socket.io server & clients.
 * @function start() Starts the socket.io server using the express webserver (http).
 * @function handleConnection() Handle a new connection (from client).
 * @function loadModules() Load all websocket modules from the modules directories
 * @function loadModule() Load a single websocket module (child of loadModules())
 * @function setupServerRules() Set all parameters before the io server starts
 **/
export default class SocketServer {
  /**
   * Starts the socket.io server using the express webserver (http).
   **/
  public server?: IoServer;

  public start(): void {
    this.server = new IoServer(expressServer.http, {
      cors: {
        origin: Config.frontendUrl,
      },
    });
    this.setupServerRules();
  }

  /**
   * Set all parameters before the io server starts
   **/
  private setupServerRules(): void {
    /** Place all socket.io rules here **/

    // Handles a new connection
    this.server?.sockets.on("connection", this.handleConnection.bind(this));
    //
    Debug(DebugMethod.info, "Server rules set for socket.io");
  }

  /**
   * Handle a new connection
   * @param {Socket} client - the socket of the new connection
   * @description
   * This function is called when a new connection is made to the server.
   * It loads all modules for the new connection.
   * It also adds a disconnect listener to the socket.
   * @example
   * io.on("connection", this.handleConnection(this.socket))
   ***/
  private handleConnection(client: Socket): void {
    Debug(
      DebugMethod.info,
      `User connected ${client.id}: ${client.handshake.headers.origin}`
    );
    Debug(DebugMethod.info, `Loading modules for ${client.id}...`);
    this.loadModules(client);
  }

  /**
   * Load all websocket modules from the modules directories
   * @param {Socket} client - the socket to load modules for (client)
   **/
  private loadModules(client: Socket): void {
    const modulesDir = path.join(__dirname, "../modules");
    const modules = fs.readdirSync(modulesDir);
    modules.forEach((moduleFile) => {
      const modulePath = path.join(modulesDir, moduleFile);
      const stats = fs.lstatSync(modulePath);
      if (stats.isDirectory()) {
        fs.readdirSync(modulePath).forEach((file) => {
          if (file.endsWith(".socket.ts")) {
            this.loadModule(modulePath, file, client);
          }
        });
      }
    });
  }

  /**
   * Load a single websocket module (child of loadModules())
   * @param {string} modulePath - Path to the module directory
   * @param {string} file - File name of the module (e.g. disconnect.socket.ts)
   * @param {Socket} client - Socket of the client
   **/
  private loadModule(modulePath: string, file: string, client: Socket): void {
    const module = require(path.join(modulePath, file)).default;
    if (module?.prototype instanceof Websocket) {
      const websocket = new module() as Websocket;
      websocket.setClient(client);
      Debug(
        DebugMethod.info,
        `(${websocket.name}) websocket-module initialized`
      );
      client.on(websocket.name, websocket.execution);
    } else {
      Debug(
        DebugMethod.error,
        `* ${file} * websocket-module not initialized (no Websocket class)`
      );
    }
  }
}
