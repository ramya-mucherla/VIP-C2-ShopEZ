const Cart = require("../models/Cart");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId", "name price image countInStock");
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add item to cart or increment quantity
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = quantity !== undefined ? Number(quantity) : 1;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate("items.productId", "name price image countInStock");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be 1 or more" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate("items.productId", "name price image countInStock");
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.productId", "name price image countInStock");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared successfully", items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
