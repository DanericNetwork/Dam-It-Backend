import { Config } from "./config";

export default function Debug(...args: any[]) {
  if (Config.env === "development") {
    console.log(...args);
  }
}
