export enum DebugMethod {
  "info" = "\x1b[37m\x1b[44mInfo\x1b[0m\x1b[37m",
  "error" = "\x1b[37m\x1b[41mError\x1b[0m\x1b[37m",
  "warn" = "\x1b[37m\x1b[43mWarn\x1b[0m\x1b[37m",
}


export default function Debug(method: DebugMethod, ...message: any) {
  switch (method) {
    case DebugMethod.info:
  }

  console.log(
    `${new Date().toLocaleString("en-GB")} ${method} ${message}`
  );
}
