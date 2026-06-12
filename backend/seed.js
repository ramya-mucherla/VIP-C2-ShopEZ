const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  { name: "iphone 15", price: 79999, image: "/images/iphone 15.jpg", category: "Electronics", description: "Apple iPhone 15 with advanced features." },
  { name: "Samsung S24", price: 74999, image: "/images/samsung s24.jpeg", category: "Electronics", description: "Samsung Galaxy S24 with AI capabilities." },
  { name: "MacBook Air", price: 114999, image: "/images/macbook air.jpeg", category: "Electronics", description: "Apple MacBook Air with M-series processor." },
  { name: "HP Laptop", price: 65999, image: "/images/hp laptop.jpeg", category: "Electronics", description: "HP Core i5 Laptop, perfect for work." },
  { name: "Sony Headphones", price: 1999, image: "/images/sony headphones.jpeg", category: "Electronics", description: "Sony over-ear wired headphones with deep bass." },
  { name: "Boat Earbuds", price: 1499, image: "/images/boat earbuds.jpeg", category: "Electronics", description: "Boat Airdopes, true wireless earbuds." },
  { name: "Nike Shoes", price: 3999, image: "/images/nike shoes.jpeg", category: "Fashion", description: "Nike sports shoes for comfort and style." },
  { name: "Adidas Shoes", price: 4599, image: "/images/adidas shoes.jpeg", category: "Fashion", description: "Adidas running sneakers, lightweight." },
  { name: "Apple Watch", price: 34999, image: "/images/apple watch.jpeg", category: "Electronics", description: "Apple Watch Series, track your fitness." },
  { name: "Realme Phone", price: 15999, image: "/images/realme phone.jpeg", category: "Electronics", description: "Realme budget smartphone with great camera." },
  { name: "Redmi Note", price: 12999, image: "/images/redmi note.jpeg", category: "Electronics", description: "Redmi Note, feature packed value phone." },
  { name: "Canon Camera", price: 55999, image: "/images/canon camera.jpeg", category: "Electronics", description: "Canon DSLR camera for photography enthusiasts." },
  { name: "Gaming Mouse", price: 999, image: "/images/gaming mouse.jpeg", category: "Electronics", description: "RGB mechanical gaming mouse with custom DPI." },
  { name: "crafted elephant", price: 2499, image: "/images/crafted elephant.jpeg", category: "Home Decor", description: "Handcrafted wooden elephant showpiece." },
  { name: "antique decor", price: 2999, image: "/images/antique decor.jpeg", category: "Home Decor", description: "Beautiful antique decor item for living rooms." },
  { name: "wall hanger", price: 2299, image: "/images/wall hanger.jpeg", category: "Home Decor", description: "Elegant wooden key and clothes wall hanger." },
  { name: "pink stone chain", price: 5999, image: "/images/pink stone chain.jpeg", category: "Jewelry", description: "Exquisite pink stone necklace chain." },
  { name: "swarovski peach", price: 8599, image: "/images/swarovski peach.jpeg", category: "Jewelry", description: "Swarovski crystal peach pendant chain." },
  { name: "orange mini frock", price: 1999, image: "/images/orange mini frock.jpeg", category: "Fashion", description: "Stylish orange mini frock dress for girls." },
  { name: "floral maxi dress", price: 1799, image: "/images/floral maxi dress.jpeg", category: "Fashion", description: "Flowy floral summer maxi dress." }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing products...");
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    console.log("Inserting seed products...");
    await Product.insertMany(products);
    console.log("Seeding completed successfully.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
