const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { auth, admin } = require("../middleware/authMiddleware");

// @route POST /api/upload
// @access Admin only
router.post("/", auth, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Return the URL to access the file
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ imageUrl: fileUrl, filename: req.file.filename });
});

module.exports = router;
