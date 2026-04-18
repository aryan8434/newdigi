const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_KEY, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn(
      "⚠️ Server running without database - some features may be unavailable",
    );
    // Don't rethrow - allow server to run without DB for now
  }
}

module.exports = main;
