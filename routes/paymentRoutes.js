import express from "express";
import {
  checkEsewaStatus,
  createKhaltiPayment,
  verifyKhaltiPayment,
  initiateEsewa,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Khalti Routes
router.post("/khalti/initiate", isAuthenticated, createKhaltiPayment);
router.post("/khalti/verify", isAuthenticated, verifyKhaltiPayment);

// ESewa Routes
router.post("/esewa/initiate", isAuthenticated, initiateEsewa);
router.get("/esewa/status", isAuthenticated, checkEsewaStatus);

export default router;
