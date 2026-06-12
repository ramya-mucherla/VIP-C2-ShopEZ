const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");

// ==========================================
// 1. DASHBOARD & ANALYTICS
// ==========================================

// @desc    Get dashboard metrics, low stock items, and recent activity
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sum revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Filter sub-stats
    const pendingOrdersCount = await Order.countDocuments({ status: "Pending" });
    const lowStockProductsCount = await Product.countDocuments({ countInStock: { $lt: 5 } });
    const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } }).select("name countInStock price image");

    // Fetch activities
    const recentActivities = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      metrics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrdersCount,
        lowStockProductsCount,
      },
      lowStockProducts,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get dashboard analytics charts data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const users = await User.find({});
    const products = await Product.find({});

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 1. Monthly Revenue & Orders (Last 6 Months)
    const monthlyRevenue = {};
    const monthlyOrders = {};
    const usersGrowth = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      monthlyRevenue[monthName] = 0;
      monthlyOrders[monthName] = 0;
      usersGrowth[monthName] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const monthName = months[orderDate.getMonth()];
      if (monthlyRevenue[monthName] !== undefined) {
        monthlyRevenue[monthName] += order.totalAmount;
        monthlyOrders[monthName]++;
      }
    });

    users.forEach((user) => {
      const joinDate = new Date(user.createdAt || Date.now());
      const monthName = months[joinDate.getMonth()];
      if (usersGrowth[monthName] !== undefined) {
        usersGrowth[monthName]++;
      }
    });

    const monthlySalesData = Object.keys(monthlyRevenue).map((month) => ({
      month,
      revenue: monthlyRevenue[month],
    }));

    const monthlyOrdersData = Object.keys(monthlyOrders).map((month) => ({
      month,
      orders: monthlyOrders[month],
    }));

    const usersGrowthData = Object.keys(usersGrowth).map((month) => ({
      month,
      newUsers: usersGrowth[month],
    }));

    // 2. Product Sales Chart (Top Selling Products)
    // Map order items count
    const productSalesMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.name;
        productSalesMap[name] = (productSalesMap[name] || 0) + item.quantity;
      });
    });

    // Sort and slice top 5
    const topProducts = Object.keys(productSalesMap)
      .map((name) => ({ name, sold: productSalesMap[name] }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // Seed dummy data if no orders exist to show nice demo charts
    const demoTopProducts = topProducts.length > 0 ? topProducts : [
      { name: "iphone 15", sold: 12 },
      { name: "Sony Headphones", sold: 8 },
      { name: "Nike Shoes", sold: 6 },
      { name: "Apple Watch", sold: 5 },
      { name: "Boat Earbuds", sold: 4 }
    ];

    res.json({
      revenueChart: monthlySalesData,
      ordersChart: monthlyOrdersData,
      usersGrowthChart: usersGrowthData,
      productSalesChart: demoTopProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 2. USER MANAGEMENT
// ==========================================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin" && req.user.id === user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await User.deleteOne({ _id: req.params.id });

    // Log Activity
    await ActivityLog.create({
      action: "User Removed",
      details: `User "${user.username}" (${user.email}) was deleted.`,
      adminId: req.user?.id,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 3. PRODUCT MANAGEMENT
// ==========================================

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, discount, countInStock, image, images, sizes, gender, featured } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "Name, price, and image are required" });
    }

    const product = new Product({
      name,
      description,
      category,
      brand,
      price,
      discount: discount || 0,
      countInStock: countInStock !== undefined ? countInStock : 10,
      image,
      images: images || [],
      sizes: sizes || [],
      gender: gender || "Unisex",
      featured: featured !== undefined ? featured : false,
    });

    const createdProduct = await product.save();

    // Log Activity
    await ActivityLog.create({
      action: "New Product Added",
      details: `Product "${name}" was created.`,
      adminId: req.user?.id,
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, discount, countInStock, image, images, sizes, gender, featured } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.category = category || product.category;
    product.brand = brand !== undefined ? brand : product.brand;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.image = image || product.image;
    product.images = images || product.images;
    product.sizes = sizes || product.sizes;
    product.gender = gender || product.gender;
    product.featured = featured !== undefined ? featured : product.featured;

    const updatedProduct = await product.save();

    // Log Activity
    await ActivityLog.create({
      action: "Product Updated",
      details: `Product "${product.name}" was modified.`,
      adminId: req.user?.id,
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });

    // Log Activity
    await ActivityLog.create({
      action: "Product Deleted",
      details: `Product "${product.name}" was removed.`,
      adminId: req.user?.id,
    });

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 4. ORDER MANAGEMENT
// ==========================================

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "username email")
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (status === "Delivered") {
      order.deliveryDate = new Date();
    }

    const updatedOrder = await order.save();

    // Log Activity
    await ActivityLog.create({
      action: status === "Cancelled" ? "Order Cancelled" : "Order Delivered",
      details: `Order status for ID ${order._id.toString().slice(-8).toUpperCase()} was changed to "${status}".`,
      adminId: req.user?.id,
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 5. CATEGORY MANAGEMENT
// ==========================================

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name, description });
    const createdCategory = await category.save();

    // Log Activity
    await ActivityLog.create({
      action: "Category Added",
      details: `Category "${name}" was created.`,
      adminId: req.user?.id,
    });

    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;

    const updatedCategory = await category.save();

    // Log Activity
    await ActivityLog.create({
      action: "Category Updated",
      details: `Category "${category.name}" details were modified.`,
      adminId: req.user?.id,
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteOne({ _id: req.params.id });

    // Log Activity
    await ActivityLog.create({
      action: "Category Deleted",
      details: `Category "${category.name}" was removed.`,
      adminId: req.user?.id,
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
};
