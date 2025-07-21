import express from "express";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderControllers.js";

const router = express.Router();

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
