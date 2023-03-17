import { Server as IoServer } from "socket.io";
import jwt from "jsonwebtoken";
import { Application } from "express";
import { Server as HttpServer } from "http";

export default class SocketServer {
    public io: IoServer;
    private jwt: any;

    constructor(private app: Application, private http: HttpServer) {
        this.io = require("socket.io")(this.http, {
            cors: {
                origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_DOMAIN : "http://localhost:8080",
            },
        });
    }

    public init(): void|any {
        this.io.use(async (socket: any, next: any) => {
            this.jwt = process.env.JWT_SECRET;
            const token = socket.handshake.auth.token;
            try {
                const user = jwt.verify(token, this.jwt);
                console.log("user", user);
                socket.user = user;
                next();
            } catch (e: any) {
                console.log("error", e);
                next(new Error("Authentication error"));
            } finally {
                console.log("Websocket connection established");
            }
        });
    };
}