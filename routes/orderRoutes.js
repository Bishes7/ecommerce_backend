import express from "express";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  getOrderStats,
  getOrderStatusStats,
  getRevenueStats,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderControllers.js";

const router = express.Router();

// get order stats
router.get("/stats", isAuthenticated, admin, getOrderStats);

// get order status stats
router.get("/status-stats", isAuthenticated, admin, getOrderStatusStats);

// get order revenue stats
router.get("/revenue-stats", isAuthenticated, admin, getRevenueStats);

router
  .route("/")
  .post(isAuthenticated, addOrderItems)
  .get(isAuthenticated, admin, getOrders);

router.route("/mine").get(isAuthenticated, getMyOrders);

router.route("/:id").get(isAuthenticated, getOrderById);

router.route("/:id/pay").put(isAuthenticated, updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(isAuthenticated, admin, updateOrderToDelivered);

export default router;
