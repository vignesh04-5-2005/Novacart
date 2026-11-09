const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// Admin
router.get("/admin", protect, adminOnly, getAllOrders);

router.put("/admin/:id", protect, adminOnly, updateOrderStatus);

// Customer single order
router.get("/:id", protect, getOrderById);

module.exports = router;
