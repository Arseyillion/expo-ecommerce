import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

async function testProductUpdateAPI() {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("🔗 Connected to MongoDB");
    
    // Find a product to test with
    const testProduct = await Product.findOne({ name: "Running Shoes - Pro Edition" });
    if (!testProduct) {
      console.log("❌ Test product not found");
      return;
    }
    
    console.log("📋 Before update:");
    console.log(`  - ${testProduct.name}: discount=${testProduct.discount}, hasDiscount=${testProduct.hasDiscount}, discountedPrice=${testProduct.discountedPrice}`);
    
    // Simulate the exact data structure from admin form
    const mockReqBody = {
      name: testProduct.name,
      description: testProduct.description,
      price: testProduct.price.toString(),
      stock: testProduct.stock.toString(),
      category: testProduct.category,
      isNewArrival: testProduct.isNewArrival ? "true" : "false",
      discount: "35" // This is how it comes from the form as a string
    };
    
    console.log("📝 Mock request body:", mockReqBody);
    
    // Simulate the exact controller logic
    const { name, description, price, stock, category, isNewArrival, discount } = mockReqBody;
    
    // Update fields if they are provided in the request body
    if (name) testProduct.name = name;
    if (description) testProduct.description = description;
    if (price !== undefined) testProduct.price = parseFloat(price);
    if (stock !== undefined) testProduct.stock = parseInt(stock);
    if (category) testProduct.category = category;
    if (isNewArrival !== undefined) testProduct.isNewArrival = Boolean(isNewArrival);
    if (discount !== undefined) {
      testProduct.discount = parseFloat(discount);
      // Calculate discounted price and hasDiscount flag
      if (testProduct.discount > 0) {
        testProduct.discountedPrice = testProduct.price * (1 - testProduct.discount / 100);
        testProduct.hasDiscount = true;
      } else {
        testProduct.discountedPrice = testProduct.price;
        testProduct.hasDiscount = false;
      }
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

testProductUpdateAPI();
