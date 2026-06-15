const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Cart = require("./models/Cart");
const Product = require("./models/Product");

async function run() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const products = await Product.find({});
    console.log(`Found ${products.length} products in DB.`);
    if (products.length > 0) {
      console.log("Sample product IDs:", products.slice(0, 3).map(p => ({ id: p._id.toString(), name: p.name })));
    }

    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts in DB.`);
    for (const cart of carts) {
      console.log(`Cart for User ${cart.userId}:`);
      console.log("Raw items:", cart.items);
      const populated = await Cart.findById(cart._id).populate("items.productId");
      console.log("Populated items:", populated.items);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
