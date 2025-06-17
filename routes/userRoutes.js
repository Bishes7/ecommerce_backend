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
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, admin, getUsers).post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile);
router
  .route("/:id")
  .delete(isAuthenticated, admin, deleteUser)
  .get(isAuthenticated, admin, getUserByID)
  .put(isAuthenticated, admin, updateUser);

export default router;
