export enum DebugMethod {
  "info" = "\x1b[37m\x1b[44m Info \x1b[0m\x1b[37m",
  "error" = "\x1b[37m\x1b[41m Error \x1b[0m\x1b[37m",
  "warn" = "\x1b[37m\x1b[43m Warn \x1b[0m\x1b[37m",
}


export default function Debug(method: DebugMethod, ...message: any) {
  switch (method) {
    case DebugMethod.info:
  }

  console.log(
    `\x1b[37m[${new Date().toLocaleTimeString()}]\x1b[0m ${method} ${message}`
  );
}
