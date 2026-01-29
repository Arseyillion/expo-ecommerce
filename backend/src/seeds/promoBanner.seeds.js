import { PromoBanner } from "../models/promoBanner.model.js";

const SEED_ID = "promo-banner-seed-v1";

const samplePromoBanners = [
    {
        seedId: SEED_ID,
        title: "UP TO 30% OFF",
        subtitle: "Apple iPhone 14 Plus",
        description: "iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features.",
        discount: "",
        buttonText: "Buy Now",
        buttonLink: "#",
        backgroundColor: "#F5F5F7",
        textColor: "#000000",
        buttonColor: "#3B82F6",
        image: "/images/promo/promo-01.png",
        imagePosition: "right",
        size: "large",
        isActive: true,
        priority: 10,
        startDate: new Date(),
    },
    {
        seedId: SEED_ID,
        title: "Workout At Home",
        subtitle: "Foldable Motorised Treadmill",
        description: "",
        discount: "Flat 20% off",
        buttonText: "Grab Now",
        buttonLink: "#",
        backgroundColor: "#DBF4F3",
        textColor: "#000000",
        buttonColor: "#14B8A6",
        image: "/images/promo/promo-02.png",
        imagePosition: "left",
        size: "small",
        isActive: true,
        priority: 8,
        startDate: new Date(),
    },
    {
        seedId: SEED_ID,
        title: "Up to 40% off",
        subtitle: "Apple Watch Ultra",
        description: "The aerospace-grade titanium case strikes the perfect balance of everything.",
        discount: "",
        buttonText: "Buy Now",
        buttonLink: "#",
        backgroundColor: "#FFECE1",
        textColor: "#000000",
        buttonColor: "#F97316",
        image: "/images/promo/promo-03.png",
        imagePosition: "right",
        size: "small",
        isActive: true,
        priority: 6,
        startDate: new Date(),
    }
];

export const seedPromoBanners = async () => {
    try {
        // Only run in development or when explicitly requested
        if (process.env.NODE_ENV !== 'development' && process.env.RUN_SEEDS !== 'true') {
            console.log('⚠️  Skipping promo banners seed (not in development mode)');
            return;
        }

        // Clear only existing seeded promo banners
        await PromoBanner.deleteMany({ seedId: SEED_ID });
        
        // Insert sample banners
        await PromoBanner.insertMany(samplePromoBanners);
        
        console.log("✅ Sample promo banners seeded successfully");
        console.log(`📦 Inserted ${samplePromoBanners.length} promo banners with seedId: ${SEED_ID}`);
    } catch (error) {
        console.error("❌ Error seeding promo banners:", error);
    }
};
