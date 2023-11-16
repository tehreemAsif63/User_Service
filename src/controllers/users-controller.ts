import UserSchema, { User } from "../schemas/users";
import { MessageException } from "../exceptions/MessageException";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MessageHandler } from "../utilities/types-utils";

const createUser: MessageHandler = async (data) => {
  const { firstName, lastName, SSN, email, password, admin, postCode, theme } =
    data;

  // validate the data of the patient
  if (
    !(firstName && lastName && SSN && email && password && admin && postCode)
  ) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }

  // find a registered Users in DB
  const registeredUser = UserSchema.find({ SSN, email });

  // check if user already registered in DB
  if ((await registeredUser).length > 0) {
    throw new MessageException({
      code: 403,
      message: "User already exists",
    });
  }

  if (!password) {
    throw new MessageException({
      code: 403,
      message: "Password is wrong",
    });
  }

  const user = new UserSchema({
    firstName,
    lastName,
    SSN,
    email,
    //password: correct password,
    admin,
    postCode,
  });
  const token = jwt.sign({ userID: user._id, SSN, email }, "secret", {
    expiresIn: "3h",
  });
  user.save();

  //connect to database

  return { ...user.$assertPopulated, token };
};

// user login
const login: MessageHandler = async (data) => {
  const { SSN, email, password } = data;
  // Validate user input
  if (typeof password != "string") {
    throw new MessageException({
      code: 400,
      message: "Invalid Data type",
    });
  }
  if (!((SSN || email) && password)) {
    throw new MessageException({
      code: 400,
      message: "All input is required",
    });
  }

  // Check if user exist in our DB
  const user = await UserSchema.findOne({ SSN, email });
  if (!user) {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }

  // if user exists and passwords match, then create and assign user token
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign({ user_id: user._id, SSN, email }, "secret", {
      expiresIn: "3h",
    });
    // save user token
    return { ...user.$assertPopulated, token };
  } else {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }
};
export default { createUser, login };
