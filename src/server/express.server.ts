import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { Config } from "../utils/config";
import Debug, { DebugMethod } from "../utils/debug";

/***
 * Represents the app (express)
 * out of this class it is possible to manage the express server
 * @function start() starts the webserver
 * @function stop() kills the webserver
 * @function setupRouteRules() set all parameters before the app is started
 ***/
export default class ExpressServer {
  public app: Application;
  public http: Server;
  public port: number | any;
  private at: Date = new Date();

  constructor() {
    this.port = Config.port;
    this.app = express();
    this.http = createServer(this.app);
  }

  /**
   * Starts the (express) webserver and log.
   **/
  public start(): void {
    this.setupRouteRules();
    this.http.listen(this.port, () => {
      Debug(
        DebugMethod.info,
        `Server started on port ${this.port} in ${new Date().getTime() - this.at.getTime()}ms`
      );
    });
  }

  /**
   * Kills webserver (manual)
   * Can be used for test purposes
   **/
  public stop(): void {
    this.http.close();
    Debug(DebugMethod.warn, "server stopped by ExpressServer.stop");
  }

  /**
   * Set all parameters before the app is started
   **/
  private setupRouteRules(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        Debug(DebugMethod.error, err.stack);
        res.status(500).send("Internal Server Error");
      }
    );
    Debug(DebugMethod.info, "Route rules set for server");
  }
}
