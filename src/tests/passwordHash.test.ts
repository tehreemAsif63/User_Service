import { createUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";
import bcrypt from "bcrypt";

jest.mock("../schemas/users");

describe("createUser", () => {
  it("should hash the password before saving the user", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      SSN: "123456789",
      email: "john.doe@example.com",
      password: "securepassword",
      theme: "dark",
    };

    const validPayload = {
      responseTopic: "users/create",
      payload: userData,
      requestInfo: {},
    };

    (UserSchema as jest.Mocked<typeof UserSchema>).find.mockResolvedValue([]);

    const bcryptHashMock = jest.spyOn(bcrypt, "hash");
    bcryptHashMock.mockImplementation((password) =>
      Promise.resolve(`hashed_${password}`)
    );

    const result = await createUser(
      validPayload.payload,
      validPayload.requestInfo
    );

    expect(bcryptHashMock).toHaveBeenCalledWith(userData.password, 10);

    expect(bcryptHashMock).toHaveBeenCalledTimes(1);

    bcryptHashMock.mockRestore();
  });
});
