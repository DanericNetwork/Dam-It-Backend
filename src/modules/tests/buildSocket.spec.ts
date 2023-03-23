import WebSocket from "../socket.builder";

describe("SocketBuilder", () => {
  it("Should create a socket", () => {
    class TestSocket extends WebSocket {
      constructor() {
        super();
        this.setExecution(() => {});
      }
    }
    const socket = new TestSocket();
    expect(socket).toBeInstanceOf(WebSocket);
    expect(socket.name).toBe("testsocket");
    expect(socket.execution).toBeInstanceOf(Function);
    });
    it("Should create a socket with a client to use", () => {
        class TestSocket extends WebSocket {
            constructor() {
            super();
            this.setExecution(() => {});
            }
        }
        const socket = new TestSocket();
        socket.setClient("client" as any);
        expect(socket).toBeInstanceOf(WebSocket);
        expect(socket.client).toBe("client");
    });
});
