import UserSchema, { User } from "../schemas/users";
import { MessageException } from "../exceptions/MessageException";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MessageHandler, MessageData } from "../utilities/types-utils";

const createUser: MessageHandler = async (data) => {
  const { firstName, lastName, SSN, email, password, theme } = data;

  // validate the data of the patient
  if (
    !(
      firstName &&
      lastName &&
      SSN &&
      email &&
      password&&
      theme 
    )
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
  const passwordHash = await bcrypt.hash(`${password}`, 10);
  const user = new UserSchema({
    firstName,
    lastName,
    SSN,
    email,
    password: passwordHash,
    theme
  });

  user.save();

  return user;
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
      code: 404,
      message: "Invalid records",
    });
  }

  // if user exists and passwords match
  if (!(await bcrypt.compare(password, user.password))) {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }
  return user;
};

// return user with a specific ID
const getUser: MessageHandler = async (data, requestInfo) => {
  const { user_id } = data;
  console.log("I am here", requestInfo);
  const user = await UserSchema.findById(user_id);

  if (!user) {
    throw new MessageException({
      code: 400,
      message: "Invalid user ID",
    });
  }

  if (user === null) {
    throw new MessageException({
      code: 400,
      message: "User does not exist",
    });
  }

  return user;
};

// delete user with a specific ID
const deleteUser: MessageHandler = async (data) => {
 /* if(!requestInfo.user?.admin){
    throw new MessageException({
      code: 403,
      message: "Forbidden",
    });
  }*/

  const { user_id } = data;

  const user = await UserSchema.findByIdAndDelete(user_id);

  if (!user) {
    throw new MessageException({
      code: 400,
      message: "Invalid id",
    });
  }

  if (user === null) {
    throw new MessageException({
      code: 400,
      message: "User does not exist",
    });
  }

  return "User deleted";
};

// updates a user given the ID
const updateUser: MessageHandler = async (data) => {
  const { user_id, firstName, lastName, SSN, email,password} = data;
  const user = await UserSchema.findByIdAndUpdate(
    user_id,
    { firstName, lastName, SSN, email, password},
    { new: true }
  );
  return user;
};

export default {
  createUser,
  login,
  getUser,
  deleteUser,
  updateUser,
};
