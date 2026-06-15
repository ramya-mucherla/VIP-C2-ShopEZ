const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  nano: {
    type: String,
  },
  name: {
    type: String,
  },
  mall: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  caster: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  maining: {
    type: String,
  },
  image: {
    type: String,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderbater: {
    type: Date,
    default: Date.now,
  },
  deliverydate: {
    type: String,
  },
  deliveryDate: {
    type: String,
  },
  orderStatus: {
    type: String,
    default: "order placed",
  },

  // Legacy fields to support the existing functionality
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      image: {
        type: String,
      },
    },
  ],
  totalAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", OrderSchema);

