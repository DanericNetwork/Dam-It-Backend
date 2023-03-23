import { Room } from "../room/room.service";

describe("RoomService", () => {
  it("Should create a roomObject", () => {
    const room = new Room();
    expect(room).toBeTruthy();
    expect(room.pin).toBeGreaterThan(100000);
    expect(room.pin).toBeLessThan(999999);
    expect(room.created_at).toBeInstanceOf(Date);
  });
});
