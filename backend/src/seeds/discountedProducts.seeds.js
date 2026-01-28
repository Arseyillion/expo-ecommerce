import { Product } from '../models/product.model.js';

const discountedProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 199.99,
    stock: 50,
    category: "Electronics",
    images: ["/images/products/headphones-1.jpg"],
    discount: 25, // 25% discount
    discountedPrice: 199.99 * (1 - 25/100), // Manual calculation
    hasDiscount: true,
    averageRating: 4.5,
    totalReviews: 128,
    isNewArrival: true
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.",
    price: 299.99,
    stock: 75,
    category: "Electronics",
    images: ["/images/products/smartwatch-1.jpg"],
    discount: 15, // 15% discount
    discountedPrice: 299.99 * (1 - 15/100), // Manual calculation
    hasDiscount: true,
    averageRating: 4.3,
    totalReviews: 89,
    isNewArrival: false
  },
  {
    name: "Organic Yoga Mat",
    description: "Eco-friendly, non-slip yoga mat with extra cushioning for comfortable practice sessions.",
    price: 49.99,
    stock: 100,
    category: "Fitness",
    images: ["/images/products/yoga-mat-1.jpg"],
    discount: 40, // 40% discount
    discountedPrice: 49.99 * (1 - 40/100), // Manual calculation
    hasDiscount: true,
    averageRating: 4.7,
    totalReviews: 203,
    isNewArrival: false
  },
  {
    name: "Portable Coffee Maker",
    description: "Compact and efficient coffee maker perfect for home, office, or travel use.",
    price: 89.99,
    stock: 30,
    category: "Kitchen",
    images: ["/images/products/coffee-maker-1.jpg"],
    discount: 20, // 20% discount
    discountedPrice: 89.99 * (1 - 20/100), // Manual calculation
    hasDiscount: true,
    averageRating: 4.2,
    totalReviews: 67,
    isNewArrival: true
  },
  {
    name: "Running Shoes Ultra",
    description: "Professional running shoes with advanced cushioning and breathable mesh upper.",
    price: 159.99,
    stock: 60,
    category: "Sports",
    images: ["/images/products/shoes-1.jpg"],
    discount: 30, // 30% discount
    discountedPrice: 159.99 * (1 - 30/100), // Manual calculation
    hasDiscount: true,
    averageRating: 4.6,
    totalReviews: 156,
    isNewArrival: false
  }
];

export const seedDiscountedProducts = async () => {
  try {
    // Clear existing discounted products
    await Product.deleteMany({ discount: { $gt: 0 } });
    
    // Insert new discounted products
    await Product.insertMany(discountedProducts);
    
    console.log('✅ Discounted products seeded successfully!');
    
    // Display the seeded products with their calculated prices
    const products = await Product.find({ discount: { $gt: 0 } });
    console.log('\n📦 Seeded Products with Discounts:');
    products.forEach(product => {
      console.log(`\n🏷️  ${product.name}`);
      console.log(`   Original Price: $${product.price.toFixed(2)}`);
      console.log(`   Discount: ${product.discount}%`);
      console.log(`   Final Price: $${product.discountedPrice.toFixed(2)}`);
      console.log(`   Savings: $${(product.price - product.discountedPrice).toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding discounted products:', error);
  }
};
