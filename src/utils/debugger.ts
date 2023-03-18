// Make a function that only console.logs if the environment is development
export default function Debug(...args: any[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
