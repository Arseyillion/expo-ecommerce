import { Carousel } from "../models/carousel.model.js";
import mongoose from "mongoose";

const seedCarousels = async () => {
  try {
    // Clear existing carousels
    await Carousel.deleteMany({});
    console.log("🗑️ Cleared existing carousels");

    const carousels = [
      {
        name: "Hero Carousel",
        description: "Main hero carousel for the homepage",
        slides: [
          {
            title: "True Wireless Noise Cancelling Headphone",
            subtitle: "Sale Off",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in",
            discountPercentage: "30%",
            discountText: "Sale Off",
            buttonText: "Shop Now",
            buttonLink: "#",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
            order: 0,
            isActive: true
          },
          {
            title: "Premium Smart Watch Series",
            subtitle: "Limited Time",
            description: "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications.",
            discountPercentage: "25%",
            discountText: "Limited Time",
            buttonText: "Shop Now",
            buttonLink: "#",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
            order: 1,
            isActive: true
          },
          {
            title: "Professional Laptop Pro",
            subtitle: "Best Deal",
            description: "High-performance laptop with latest processor, dedicated graphics, and all-day battery life for professionals.",
            discountPercentage: "20%",
            discountText: "Best Deal",
            buttonText: "Shop Now",
            buttonLink: "#",
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop",
            order: 2,
            isActive: true
          }
        ],
        isActive: true,
        autoplayDelay: 2500,
        spaceBetween: 30,
        centeredSlides: true
      }
    ];

    const createdCarousels = await Carousel.insertMany(carousels);
    console.log(`✅ Created ${createdCarousels.length} carousels`);
    
    console.log("📋 Created carousels:");
    createdCarousels.forEach((carousel, index) => {
      console.log(`${index + 1}. ${carousel.name} (${carousel.slides.length} slides)`);
    });

  } catch (error) {
    console.error("❌ Error seeding carousels:", error);
  }
};

export default seedCarousels;
