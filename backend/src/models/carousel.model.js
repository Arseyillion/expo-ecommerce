import mongoose from "mongoose";

const carouselSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    discountPercentage: {
        type: String,
        default: "30%",
    },
    discountText: {
        type: String,
        default: "Sale Off",
    },
    buttonText: {
        type: String,
        default: "Shop Now",
    },
    buttonLink: {
        type: String,
        default: "#",
    },
    image: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const carouselSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    slides: [carouselSlideSchema],
    isActive: {
        type: Boolean,
        default: true,
    },
    autoplayDelay: {
        type: Number,
        default: 2500,
    },
    spaceBetween: {
        type: Number,
        default: 30,
    },
    centeredSlides: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Carousel = mongoose.model("Carousel", carouselSchema);
