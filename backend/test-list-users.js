const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const users = await User.find({});
    console.log("Registered Users count:", users.length);
    console.log("Users:", JSON.stringify(users.map(u => ({ username: u.username, email: u.email, role: u.role, createdAt: u.createdAt })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
