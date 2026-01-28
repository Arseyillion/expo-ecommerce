import { PromoBanner } from "../models/promoBanner.model.js";

const samplePromoBanners = [
    {
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
        // Clear existing banners
        await PromoBanner.deleteMany({});
        
        // Insert sample banners
        await PromoBanner.insertMany(samplePromoBanners);
        
        console.log("Sample promo banners seeded successfully");
    } catch (error) {
        console.error("Error seeding promo banners:", error);
    }
};
