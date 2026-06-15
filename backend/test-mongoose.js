const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

async function run() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected!");
    
    console.log("Running User.findOne...");
    const user = await User.findOne({ email: "test@example.com" }).maxTimeMS(5000);
    console.log("Query completed successfully. Result:", user);
    
  } catch (err) {
    console.error("Mongoose Test Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Mongoose disconnected.");
  }
}

run();
