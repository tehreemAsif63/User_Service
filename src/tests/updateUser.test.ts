import { updateUser } from "../controllers/users-controller";
import { MessageException } from "../exceptions/MessageException";
import UserSchema from "../schemas/users";

jest.mock("../schemas/users");

describe("updateUser function", () => {
  let mockUserId: string;

  beforeAll(() => {
    mockUserId = "someUserId";
  });

  it("should update user and return the updated user", async () => {
    const mockUpdatedUser = {
      _id: mockUserId,
      firstName: "David",
      lastName: "Hong",
      SSN: "123456789",
      email: "David@gmail.com",
      password: "000000",
    };

    const findByIdAndUpdateMock = jest
      .spyOn(UserSchema, "findByIdAndUpdate")
      .mockResolvedValueOnce(mockUpdatedUser);

    const result = await updateUser(
      {
        _id: mockUserId,
        firstName: "David",
        lastName: "Hong",
        SSN: "123456789",
        email: "David@gmail.com",
        password: "000000",
      },
      {} as any
    );

    expect(result).toEqual(mockUpdatedUser);

    findByIdAndUpdateMock.mockRestore();
  });
});
