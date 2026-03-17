import mongoose from "mongoose"
import { ENV } from "../config/env.js"

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("✅ Connected to MongoDB",conn.connection.host)
        
        // Fix the clerkId unique index issue
        // await fixClerkIdIndex();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
        process.exit(1) // exit process with failure,0 for success
    }
}

async function fixClerkIdIndex() {
    try {
        // Use the Order model to get the collection
        const { Order } = await import("../models/order.model.js");
        
        // Try to drop the index directly without checking first
        try {
            await Order.collection.dropIndex({ clerkId: 1 });
            console.log("✅ Successfully removed clerkId unique index");
        } catch (dropError) {
            if (dropError.code === 27) {
                console.log("ℹ️ clerkId index doesn't exist, no action needed");
            } else {
                // Try alternative method - get all indexes and find the clerkId one
                const indexes = await Order.collection.getIndexes();
                console.log("📋 Current indexes:", Object.keys(indexes));
                
                // Look for any index that contains clerkId
                const clerkIdIndexName = Object.keys(indexes).find(key => {
                    const indexKey = indexes[key].key;
                    return indexKey && indexKey.clerkId === 1;
                });
                
                if (clerkIdIndexName) {
                    console.log(`🔧 Found clerkId index: ${clerkIdIndexName}, removing it...`);
                    await Order.collection.dropIndex(clerkIdIndexName);
                    console.log("✅ Successfully removed clerkId unique index");
                } else {
                    console.log("ℹ️ No clerkId index found in any form");
                }
            }
        }
    } catch (error) {
        console.log("⚠️ Warning: Could not fix clerkId index:", error.message);
    }
}