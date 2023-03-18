export default function Debug(...args: any[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
