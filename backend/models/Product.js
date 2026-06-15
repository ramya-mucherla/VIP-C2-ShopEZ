const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "General",
  },
  brand: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    default: 0,
  },
  countInStock: {
    type: Number,
    default: 10,
  },
  sizes: {
    type: [String],
    default: [],
  },
  gender: {
    type: String,
    default: "Unisex",
  },
  rating: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
