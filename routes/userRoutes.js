import express from "express";
import {
  deleteUser,
  getUserByID,
  getUserProfile,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/UserController.js";

const router = express.Router();

router.route("/").get(getUsers).post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.route("/:id").delete(deleteUser).get(getUserByID).put(updateUser);

export default router;
