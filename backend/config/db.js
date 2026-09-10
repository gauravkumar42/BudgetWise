const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/budgetwise";
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error(
      "   Make sure MongoDB is running locally or set MONGO_URI to a MongoDB Atlas connection string in .env"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
