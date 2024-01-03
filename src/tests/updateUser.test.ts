import { updateUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("updateSlots", () => {
  it("should return user not found", async () => {
    const userData = {
      user_id: "testId",
    };

    const requestInfo = {};

    const findByIdMock = jest.spyOn(UserSchema, "findById");
    findByIdMock.mockResolvedValue(null);

    await expect(updateUser(userData, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 400,
        message: "User not found",
      })
    );

    findByIdMock.mockRestore();
  });

  it("should return input missing data, all data required", async () => {
    const existingUser = {
      user_id: "testId",
      firstName: "David",
      lastName: "Hong",
      email: "test@user.com",
      password: "000000",
    };

    const updateInfo = {
      user_id: "testId",
      firstName: "DAVID",
    };

    const requestInfo = {};

    const findByIdMock = jest.spyOn(UserSchema, "findById");
    findByIdMock.mockResolvedValue(existingUser);

    await expect(updateUser(updateInfo, requestInfo)).rejects.toThrow(
      new MessageException({
        code: 403,
        message: "Input missing data, All data required",
      })
    );

    findByIdMock.mockRestore();
  });
});
