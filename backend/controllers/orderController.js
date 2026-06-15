const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Create a new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { 
      paymentMethod,
      name, nano,
      email, mall,
      address,
      pincode,
      category, caster,
      description,
      image, maining,
      size,
      quantity,
      discount,
      orderDate, orderbater,
      deliveryDate, deliverydate,
      orderStatus
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Process order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return res.status(400).json({ message: "Some products in your cart no longer exist" });
      }

      // Check stock
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.countInStock}`,
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      totalAmount += product.price * item.quantity;

      // Decrement stock
      product.countInStock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "UPI",
      // Set tentative delivery date (e.g. 5 days from now)
      deliveryDate: deliveryDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deliverydate: deliverydate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      name: name || nano || (orderItems.length > 0 ? orderItems[0].name : ""),
      nano: nano || name || (orderItems.length > 0 ? orderItems[0].name : ""),
      email: email || mall || "",
      mall: mall || email || "",
      address: address || "",
      pincode: pincode || "",
      category: category || caster || (orderItems.length > 0 && orderItems[0].productId ? orderItems[0].productId.category : ""),
      caster: caster || category || (orderItems.length > 0 && orderItems[0].productId ? orderItems[0].productId.category : ""),
      description: description || "",
      image: image || maining || (orderItems.length > 0 ? orderItems[0].image : ""),
      maining: maining || image || (orderItems.length > 0 ? orderItems[0].image : ""),
      size: size || "",
      quantity: quantity || (orderItems.length > 0 ? orderItems[0].quantity : 1),
      discount: discount || 0,
      orderDate: orderDate || orderbater || new Date(),
      orderbater: orderbater || orderDate || new Date().toISOString(),
      orderStatus: orderStatus || "order placed",
      status: "Pending"
    });

    const createdOrder = await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "username email").sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Please specify status" });
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
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
