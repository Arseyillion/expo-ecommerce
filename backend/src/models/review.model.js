import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: "",
        maxlength: 100
    },
    comment: {
        type: String,
        default: "",
        maxlength: 1000
    },
    helpful: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);