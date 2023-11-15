import UserSchema, { User } from "../schemas/users";
import { MQTTException } from "../exceptions/MQTTException";
import jt from "jsonwebtoken";
import bcrypt from "bcrypt";
const createUser = async (message: string) => {
  try {
    const userInfo: User = JSON.parse(message);
    const {
      firstName,
      lastName,
      SSN,
      email,
      password,
      admin,
      postCode,
      theme,
    } = userInfo;

    // validate the data of the patient
    if (
      !(firstName && lastName && SSN && email && password && admin && postCode)
    ) {
      // throw
      throw new MQTTException({
        code: 403,
        message: "Input missing data, All data required",
      });
    }

    // find a registered Users in DB
    const registeredUser = UserSchema.find({ SSN, email });

    // check if user already registered in DB
    if ((await registeredUser).length > 0) {
      throw new MQTTException({
        code: 403,
        message: "User already exists",
      });
    }

    if (!password) {
      throw new MQTTException({
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
    const token = jt.sign({ userID: user._id, SSN, email }, "secret", {
      expiresIn: "3h",
    });
    user.save();

    //connect to database

    return { ...user.$assertPopulated, token };
  } catch (error) {
    if (error instanceof MQTTException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    };
  }
};
// user login
const login = async (message: string) => {
  try {
    const userInfo = JSON.parse(message);
    const { SSN, email, password } = userInfo;
    // Validate user input
    if (!((SSN || email) && password)) {
      throw new MQTTException({
        code: 400,
        message: "All input is required",
      });
    }

    // Check if user exist in our DB
    const user = await UserSchema.findOne({ SSN, email });
    if (!user) {
      throw new MQTTException({
        code: 401,
        message: "Invalid records",
      });
    }

    // if user exists and passwords match, then create and assign user token
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jt.sign({ user_id: user._id, SSN, email }, "secret", {
        expiresIn: "3h",
      });
      // save user token
      return { ...user.$assertPopulated, token };
    } else {
      throw new MQTTException({
        code: 401,
        message: "Invalid records",
      });
    }
  } catch (error) {
    if (error instanceof MQTTException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    };
  }
};
