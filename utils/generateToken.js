import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const isProd = (process.env.NODE_ENV = "production");
  // token sign
  const token = jwt.sign({ userId }, process.env.JWT_SECRETKEY, {
    expiresIn: "30d",
  });

  // Set jwt as HTTP-only co0kie
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
  });
};

export default generateToken;
