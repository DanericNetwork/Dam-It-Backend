import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { Config } from "../utils/config";

export default class ExpressServer {
  public app: Application;
  public http: Server;
  public port: number | any;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.http = createServer(this.app);

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send("Internal Server Error");
      }
    );
  }

  public start(): void {
    this.http.listen(this.port, () => {
      console.log(
        `\nExpress server listening on port ${this.port} on ${Config.env} mode\n`
      );
    });
  }

  public stop(): void {
    this.http.close();
  }
}
