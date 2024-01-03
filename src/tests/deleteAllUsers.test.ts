import { deleteAllUsers } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("deleteAllUsers", () => {
  it("should return forbidden", async () => {
    const requestInfo = {
      user: {
        id: "someUserId",
        email: "user@example.com",
        userType: "notAdmin",
        admin: false,
        firstName: "David",
        lastName: "Hong",
      },
      requestID: "someRequestId",
    };

    const data = {};

    await expect(deleteAllUsers(data, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Forbidden",
      })
    );
  });
});
