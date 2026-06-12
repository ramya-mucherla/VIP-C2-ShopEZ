const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { auth, admin } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", auth, admin, createProduct);
router.put("/:id", auth, admin, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;
