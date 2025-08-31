import express from "express";
import {
  createKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/paymentController.js";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/khalti", isAuthenticated, admin, createKhaltiPayment);
router.post("/khalti/verify", isAuthenticated, admin, verifyKhaltiPayment);

export default router;
