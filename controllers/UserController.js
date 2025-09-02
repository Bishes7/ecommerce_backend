import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userSchema.js";
import router from "../routes/productRoutes.js";
import { comparePassword, encryptPassword } from "../utils/bcrypt.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user?._id && comparePassword(password, user.password)) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc   Register User
// @route  POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  // check if the user exists
  const userExists = await User.findOne({ email });
  if (userExists?._id) {
    res.status(400);
    throw new Error("User already exists");
  }

  // if user dont exists // encrypt the password and save
  req.body.password = encryptPassword(password);

  const user = await User(req.body).save();

  if (user?._id) {
    generateToken(res, user._id);
    await sendEmail({
      to: email,
      subject: "Welcome to B&B electronics shopping website",
      text: `Hi ${name}, Welcome to B&B Electronics. You account has been created successfully`,
      html: `
      <h2>Welcome, ${name}</h2>
      <p>Thank you for joining <strong>B&B Electronics</strong>. Your account has been successfully created.</p>
        <p>Visit your account dashboard here: <a href="https://localhost:5173/login">Login</a></p>`,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid details");
  }
});

// @desc   Logout user and clear cookie
// @route  POST /api/users/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc   Get user profile
// @route  POST /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userInfo._id);

  if (user?._id) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userInfo._id);

  if (user?._id) {
    (user.name = req.body.name), (user.email = req.body.email);

    if (req.body.password) {
      user.password = encryptPassword(req.body.password);
    }
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Get users
// @route  GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc   Get user by ID
// @route  GET /api/users/:id
// @access Private/Admin
export const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

// @desc   Delete User
// @route  DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Update User
// @route  PUT /api/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Forgot passsword controller

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save token and expiration to DB
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Click the link below to reset your password:\n\n${resetUrl}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: message,
  });

  res.json({ message: "Password reset link sent to your email" });
});

// reset password controller
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // hash the token to match the DB
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // FInd user with token and enseure token isnt expired
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }
  // update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully" });
});

export default router;
