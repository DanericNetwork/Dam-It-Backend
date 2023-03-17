import express, { Application, Request, Response } from 'express';
import { createServer, Server } from 'http';

export default class ExpressServer {
  public app: Application;
  public http: Server;
  public port: number | any;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.http = createServer(this.app);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ status: 'Ok' });
    });
  }

  public start(): void {
    this.http.listen(this.port, () => {
      console.log(`\nExpress server listening on port ${this.port} on ${process.env.NODE_ENV} mode\n`);
    });
  }

  public stop(): void {
    this.http.close();
  }
}