import { config as initEnv } from "dotenv";
import Debug, { DebugMethod } from "./debug";
import fs from "fs";
import path from "path";

fs.existsSync(path.join(__dirname, "../../.env"))
  ? initEnv()
  : Debug(DebugMethod.warn, "No .env file found, please create one!");

export const Config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:8080",
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/dam-it",
};
