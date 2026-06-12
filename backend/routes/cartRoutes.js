const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { auth } = require("../middleware/authMiddleware");

// All cart endpoints are protected
router.use(auth);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
