import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductStats,
  getTopProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

// get products stats
router.get("/stats", isAuthenticated, admin, getProductStats);

router.get("/top", getTopProducts);

router.get("/:id", getProduct);

router.post("/", isAuthenticated, admin, createProduct);

router.put("/:id", isAuthenticated, admin, updateProduct);

router.delete("/:id", deleteProduct);

// create a review route
router.post("/:id/reviews", isAuthenticated, createProductReview);

export default router;
