import Websocket from "../socket.builder";
  
export default new Websocket("connection", (socket: any) => {
    let token = socket.handshake.auth.token;
    console.log("a user connected " + token);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });