import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { Config } from "../utils/config";
import Debug, { DebugMethod } from "../utils/debug";

export default class ExpressServer {
  public app: Application;
  public http: Server;
  public port: number | any;

  constructor() {
    this.port = Config.port;
    this.app = express();
    this.http = createServer(this.app);
    // Error handling
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send("Internal Server Error");
      }
    );
  }

  public start(): void {
    this.http.listen(this.port, () => {
      Debug(DebugMethod.info, 
        `Server is running port ${this.port} on ${Config.env} mode`
      );
    });
  }

  public stop(): void {
    this.http.close();
  }
}
