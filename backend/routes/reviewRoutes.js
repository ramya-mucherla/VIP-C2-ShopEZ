const express = require("express");
const router = express.Router();
const { getProductReviews, createReview } = require("../controllers/reviewController");
const { auth } = require("../middleware/authMiddleware");

router.get("/:productId", getProductReviews);
router.post("/", auth, createReview);

module.exports = router;
