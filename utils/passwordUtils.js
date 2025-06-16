import bcrypt from "bcryptjs";

export const comparePassword = (enteredPassword, hashPassword) => {
  return bcrypt.compareSync(enteredPassword, hashPassword);
};
