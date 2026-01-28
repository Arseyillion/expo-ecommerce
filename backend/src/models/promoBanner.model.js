import mongoose from "mongoose";

const promoBannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    discount: {
        type: String,
        required: false,
        trim: true
    },
    buttonText: {
        type: String,
        required: false,
        default: "Buy Now",
        trim: true
    },
    buttonLink: {
        type: String,
        required: false,
        default: "#"
    },
    backgroundColor: {
        type: String,
        required: false,
        default: "#F5F5F7"
    },
    textColor: {
        type: String,
        required: false,
        default: "#000000"
    },
    buttonColor: {
        type: String,
        required: false,
        default: "#3B82F6"
    },
    image: {
        type: String,
        required: false
    },
    imagePosition: {
        type: String,
        enum: ["left", "right", "bottom"],
        default: "right"
    },
    size: {
        type: String,
        enum: ["large", "small"],
        default: "large"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });

export const PromoBanner = mongoose.model("PromoBanner", promoBannerSchema);
