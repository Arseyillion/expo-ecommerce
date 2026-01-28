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

    // Update each product to add the missing fields
    for (const product of productsWithoutDiscountFields) {
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            discount: 0,
            discountedPrice: product.price,
            hasDiscount: false
          }
        }
      );
      console.log(`✅ Updated product: ${product.name}`);
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
