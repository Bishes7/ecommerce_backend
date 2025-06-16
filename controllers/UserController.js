import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userSchema.js";
import router from "../routes/productRoutes.js";
import { comparePassword } from "../utils/passwordUtils.js";

// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user._id && comparePassword(password, user.password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
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
  res.send("register user");
});

// @desc   Logout user and clear cookie
// @route  POST /api/users/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.send("logout user");
});

// @desc   Get user profile
// @route  POST /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  res.send("get user profile");
});

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("update user profile");
});

// @desc   Get users
// @route  GET /api/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});

// @desc   Get user by ID
// @route  GET /api/users/:id
// @access Private/Admin
export const getUserByID = asyncHandler(async (req, res) => {
  res.send("get user by id");
});

// @desc   Delete User
// @route  DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user");
});

// @desc   Update User
// @route  PUT /api/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) =>
  res.send("update user")
);

export default router;
