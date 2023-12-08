/*import { getUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";
import bcrypt from "bcrypt";

jest.mock("../schemas/users");

describe("findUser", () => {
  it("should return Invalid user ID when using a wrong user_id", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      SSN: "123456789",
      email: "john.doe@example.com",
      password: "securepassword",
      theme: "dark",
    };

    const validPayload = {
      responseTopic: "users/me/:user_id",
      payload: userData,
      requestInfo: {},
    };

    (UserSchema as jest.Mocked<typeof UserSchema>).find.mockResolvedValue([]);
  });
});
**/
