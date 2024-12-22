import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
} from "../controllers/order.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protectRoute, createOrder);
router.get("/admin-orders", protectRoute, adminRoute, getOrders);
router.get("/mine", protectRoute, getMyOrders);
router.get("/:id", protectRoute, getOrderById);
router.put("/:id/pay", protectRoute, updateOrderToPaid);
router.put("/:id/deliver", protectRoute, adminRoute, updateOrderToDelivered);

export default router;
