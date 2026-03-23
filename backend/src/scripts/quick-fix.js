import mongoose from "mongoose";

// Replace with your actual MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/test"; // or your actual connection string

async function quickFix() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // Drop the unique index on clerkId
    try {
      await ordersCollection.dropIndex({ clerkId: 1 });
      console.log("✅ Successfully dropped unique index on clerkId");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️ Index on clerkId doesn't exist");
      } else {
        console.error("⚠️ Error:", error.message);
      }
    }

    const indexes = await ordersCollection.getIndexes();
    console.log("📋 Current indexes:", Object.keys(indexes));

    await mongoose.disconnect();
    console.log("🎉 Fix completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

quickFix();
