import { login } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("login a user", () => {
  it("should return invalid data type when provided a not string type password", async () => {
    const invalidPassword = {
      SSN: "123456789",
      password: 12345678,
    };

    const requestInfo = {};

    expect.assertions(2);
    try {
      const result = await login(invalidPassword, requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe("Invalid Data type");
    }
  });
  it("should return All input is required when either SSN or email is missing", async () => {
    const missingId = {
      password: "12345678",
    };
    const requestInfo = {};

    expect.assertions(2);
    try {
      const result = await login(missingId, requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe("All input is required");
    }
  });

  it("should return Invalid records", async () => {
    const loginInfo = {
      SSN: "123456789",
      password: "000000",
    };

    const requestInfo = {};

    const findOneMock = jest.spyOn(UserSchema, "findOne");
    findOneMock.mockResolvedValue(null);

    await expect(login(loginInfo, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 401,
        message: "Invalid records",
      })
    );

    findOneMock.mockRestore();
  });
});
