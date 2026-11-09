const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({
    message: "NEW CART ROUTE IS WORKING",
  });
});

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.put("/:productId", protect, updateCartItem);

router.delete("/:productId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;
