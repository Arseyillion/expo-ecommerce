import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

// Add discount fields to existing products that don't have them
async function addDiscountFieldsToExistingProducts() {
  try {
    // Connect to database using the same config as server
    await mongoose.connect(ENV.DB_URL);
    console.log("🔗 Connected to MongoDB");

    console.log("🔄 Starting migration to add discount fields to existing products...");

    // Find all products that don't have the discount field
    const productsWithoutDiscountFields = await Product.find({
      $or: [
        { discount: { $exists: false } },
        { discountedPrice: { $exists: false } },
        { hasDiscount: { $exists: false } }
      ]
    });

    console.log(`📦 Found ${productsWithoutDiscountFields.length} products without discount fields`);

    if (productsWithoutDiscountFields.length === 0) {
      console.log("✅ All products already have discount fields. No migration needed.");
      return;
    }

    // Update each product to add only the missing fields
    for (const product of productsWithoutDiscountFields) {
      const updateFields = {};
      
      // Only add fields that are missing
      if (product.discount === undefined) {
        updateFields.discount = 0;
      }
      if (product.discountedPrice === undefined) {
        updateFields.discountedPrice = product.price;
      }
      if (product.hasDiscount === undefined) {
        updateFields.hasDiscount = false;
      }
      
      // Only update if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        await Product.updateOne(
          { _id: product._id },
          { $set: updateFields }
        );
        console.log(`✅ Updated product: ${product.name} with fields:`, Object.keys(updateFields));
      } else {
        console.log(`⏭️  Skipped product: ${product.name} (all discount fields already exist)`);
      }
    }

    console.log("🎉 Migration completed successfully!");
    console.log(`✅ Updated ${productsWithoutDiscountFields.length} products with discount fields`);

  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the migration
addDiscountFieldsToExistingProducts();
