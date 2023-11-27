import { isObjectIdOrHexString } from "mongoose";
import users from "../schemas/users";

// An assertion method to configure the authority of an admin
const assertAdmin = (admin: object) => {
  if (users != admin) {
    return {
      error: {
        code: 403,
        Message: "Don't act like an admin!!",
      },
    };
  }
};

//An assertion method to configure the authority of a personal account
const assertPersonal = (user: object) => {
  if (user == isObjectIdOrHexString) {
    return user;
  }
  return {
    error: {
      code: 403,
      Message: "Good try but our system is not that easy to hack!!",
    },
  };
};

export default { assertAdmin, assertPersonal };
