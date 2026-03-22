import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, "..");
dotenv.config({ path: path.join(backendDir, ".env") });

// Simple ENV object since we can't import the config
const ENV = {
    DB_URL: process.env.DB_URL,
};

async function fixOrderIndex() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    console.log("📍 Backend directory:", backendDir);
    console.log("📍 .env file path:", path.join(backendDir, ".env"));
    console.log("📍 Using DB_URL:", ENV.DB_URL ? "Found" : "Not found");
    
    if (!ENV.DB_URL) {
      console.log("❌ Available env vars:", Object.keys(process.env).filter(key => key.includes('DB') || key.includes('MONGO')));
      throw new Error("DB_URL not found in environment variables. Please check your .env file.");
    }
    
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Get the orders collection
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // List current indexes before dropping
    const currentIndexes = await ordersCollection.getIndexes();
    console.log("📋 Current indexes before fix:", Object.keys(currentIndexes));

    // Drop the unique index on clerkId if it exists
    try {
      await ordersCollection.dropIndex({ clerkId: 1 });
      console.log("✅ Successfully dropped unique index on clerkId");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️ Index on clerkId doesn't exist, no need to drop");
      } else {
        console.error("⚠️ Error dropping index:", error.message);
      }
    }

    // List remaining indexes
    const indexes = await ordersCollection.getIndexes();
    console.log("📋 Current indexes after fix:", Object.keys(indexes));

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    console.log("🎉 Index fix completed!");
  } catch (error) {
    console.error("❌ Error fixing index:", error);
    process.exit(1);
  }
}

// Run the function
fixOrderIndex();
