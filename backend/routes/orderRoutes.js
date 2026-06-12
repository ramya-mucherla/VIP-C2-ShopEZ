const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { auth, admin } = require("../middleware/authMiddleware");

// All routes require authentication
router.post("/", auth, createOrder);
router.get("/myorders", auth, getMyOrders);

// Admin only routes
router.get("/", auth, admin, getAllOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);

module.exports = router;
