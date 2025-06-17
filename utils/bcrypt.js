import bcrypt from "bcryptjs";

const saltRound = 15;

// hash the password
export const encryptPassword = (enteredPassword) => {
  return bcrypt.hashSync(enteredPassword, saltRound);
};

// compare the password
export const comparePassword = (enteredPassword, hashPassword) => {
  return bcrypt.compareSync(enteredPassword, hashPassword);
};
