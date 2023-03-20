import Websocket from "../socket.builder";
  
export default new Websocket("message", (msg: any) => {
    console.log("message: " + msg)
  });