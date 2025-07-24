import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProduct);

router.post("/", isAuthenticated, admin, createProduct);

router.put("/:id", isAuthenticated, admin, updateProduct);

export default router;
