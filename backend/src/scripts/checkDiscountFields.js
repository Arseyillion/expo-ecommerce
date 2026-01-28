import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

async function checkDiscountFields() {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("🔗 Connected to MongoDB");
    
    // Check products without discount fields
    const productsWithoutDiscount = await Product.find({
      $or: [
        { discount: { $exists: false } },
        { discountedPrice: { $exists: false } },
        { hasDiscount: { $exists: false } }
      ]
    });
    
    console.log(`📦 Products without discount fields: ${productsWithoutDiscount.length}`);
    
    if (productsWithoutDiscount.length > 0) {
      console.log("❌ Still missing discount fields:");
      productsWithoutDiscount.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p._id})`);
      });
    } else {
      console.log("✅ All products have discount fields");
    }
    
    // Show all products with their discount status
    const allProducts = await Product.find({});
    console.log("\n📋 All products discount status:");
    allProducts.forEach(p => {
      console.log(`  - ${p.name}: discount=${p.discount}, hasDiscount=${p.hasDiscount}, discountedPrice=${p.discountedPrice}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkDiscountFields();
