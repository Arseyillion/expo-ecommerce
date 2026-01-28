import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

async function testDiscountUpdate() {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("🔗 Connected to MongoDB");
    
    // Find a product to test with
    const testProduct = await Product.findOne({ name: "Classic Denim Jacket" });
    if (!testProduct) {
      console.log("❌ Test product not found");
      return;
    }
    
    console.log("📋 Before update:");
    console.log(`  - ${testProduct.name}: discount=${testProduct.discount}, hasDiscount=${testProduct.hasDiscount}, discountedPrice=${testProduct.discountedPrice}`);
    
    // Simulate the update logic from the admin controller
    const discount = 25; // 25% discount
    
    testProduct.discount = parseFloat(discount);
    if (testProduct.discount > 0) {
      testProduct.discountedPrice = testProduct.price * (1 - testProduct.discount / 100);
      testProduct.hasDiscount = true;
    } else {
      testProduct.discountedPrice = testProduct.price;
      testProduct.hasDiscount = false;
    }
    
    await testProduct.save();
    
    console.log("📋 After update:");
    console.log(`  - ${testProduct.name}: discount=${testProduct.discount}, hasDiscount=${testProduct.hasDiscount}, discountedPrice=${testProduct.discountedPrice}`);
    
    // Verify the update worked
    const updatedProduct = await Product.findById(testProduct._id);
    console.log("📋 Verified from database:");
    console.log(`  - ${updatedProduct.name}: discount=${updatedProduct.discount}, hasDiscount=${updatedProduct.hasDiscount}, discountedPrice=${updatedProduct.discountedPrice}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testDiscountUpdate();
