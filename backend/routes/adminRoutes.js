const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getAnalytics,
  getUsers,
  deleteUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrder,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");
const { auth, admin } = require("../middleware/authMiddleware");

// All admin routes are protected and require the 'admin' role
router.use(auth);
router.use(admin);

router.get("/dashboard", getAdminDashboard);
router.get("/analytics", getAnalytics);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getOrders);
router.put("/orders/:id", updateOrder);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
