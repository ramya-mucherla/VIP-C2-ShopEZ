const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { auth } = require("../middleware/authMiddleware");

// All wishlist routes are protected
router.get("/", auth, getWishlist);
router.post("/", auth, addToWishlist);
router.delete("/:productId", auth, removeFromWishlist);

module.exports = router;
