import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // token sign
  const token = jwt.sign({ userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "30d",
  });

  // Set jwt as HTTP-only co0kie
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "None",
    maxAge: 30 * 60 * 60 * 1000, // 30 Days
  });
};

export default generateToken;
