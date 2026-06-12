const express = require("express");
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const { auth, admin } = require("../middleware/authMiddleware");

// Public
router.get("/", getBanners);

// Protected Admin CRUD
router.post("/", auth, admin, createBanner);
router.put("/:id", auth, admin, updateBanner);
router.delete("/:id", auth, admin, deleteBanner);

module.exports = router;
