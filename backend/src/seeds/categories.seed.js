import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories");

    const categories = [
      {
        name: "Televisions",
        description: "Smart TVs, LED TVs, OLED TVs and more",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/tv-category.jpg",
        order: 1,
        isActive: true
      },
      {
        name: "Laptop & PC",
        description: "Laptops, desktop computers, and accessories",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/laptop-category.jpg",
        order: 2,
        isActive: true
      },
      {
        name: "Mobile & Tablets",
        description: "Smartphones, tablets, and mobile accessories",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/mobile-category.jpg",
        order: 3,
        isActive: true
      },
      {
        name: "Games & Videos",
        description: "Gaming consoles, video games, and accessories",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/gaming-category.jpg",
        order: 4,
        isActive: true
      },
      {
        name: "Home Appliances",
        description: "Kitchen appliances, home electronics, and more",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/home-appliances-category.jpg",
        order: 5,
        isActive: true
      },
      {
        name: "Health & Sports",
        description: "Fitness equipment, health monitors, and sports gear",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/health-sports-category.jpg",
        order: 6,
        isActive: true
      },
      {
        name: "Watches",
        description: "Smart watches, analog watches, and accessories",
        image: "https://res.cloudinary.com/dws7jyddt/image/upload/v1767373473/ecommerce/categories/watches-category.jpg",
        order: 7,
        isActive: true
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    console.log("📋 Created categories:");
    createdCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.order})`);
    });

  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};

export default seedCategories;
