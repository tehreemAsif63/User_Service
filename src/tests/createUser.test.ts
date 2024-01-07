import { createUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("createUser", () => {
  it("should throw MessageException for missing data", async () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      SSN: "123456789",
      email: "john.doe@example.com",
      theme: "dark",
    };

    const requestInfo = {};

    try {
      const result = await createUser(invalidData, requestInfo);
      expect(result).toBeDefined();
    } catch (error) {
      const messageExceptionError = error as MessageException;
      expect(messageExceptionError).toBeInstanceOf(MessageException);
      expect(messageExceptionError.message).toBe(
        "Input missing data, All data required"
      );
    }
  });

  it("should return user already exists", async () => {
    const validData = {
      firstName: "test",
      lastName: "user",
      SSN: "000000000",
      email: "test@user.com",
      password: "test",
      theme: "light",
    };
    const requestInfo = {};

    const findMock = jest.spyOn(UserSchema, "find");
    findMock.mockResolvedValue([validData]);

    await expect(createUser(validData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "User already exists",
      })
    );
    findMock.mockRestore();
  });
});
