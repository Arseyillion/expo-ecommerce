import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating, title, comment } = req.body;

    if (!productId || !orderId) {
      return res
        .status(400)
        .json({ error: "productId and orderId are required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const user = req.user;
   
    // verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ error: "Not authorized to review this order" });
    }

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ error: "Can only review delivered orders" });
    }

    // verify product is in the order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (!productInOrder) {
      return res.status(400).json({ error: "Product not found in this order" });
    }

    // Get user name and image for the review
    const userName = user.name || user.email?.split('@')[0] || 'Anonymous';
    const userImage = user.imageUrl || "";

    // atomic update or create
    const review = await Review.findOneAndUpdate(
      { productId, userId: user._id },
      { rating, orderId, productId, userId: user._id, userName, userImage, title: title || "", comment },
      { new: true, upsert: true, runValidators: true }
    );

    // UPDATE THE PRODUCT RATING WITH AGGREGATION PIPELINE APPROACH

    // Step 1: Compute average rating and total review count atomically
    // We use MongoDB's aggregation pipeline to do this in a single query,
    // which prevents race conditions when multiple users submit reviews at the same time.
    const stats = await Review.aggregate([
      // Match only reviews that belong to this product
      { $match: { productId: productId } },

      // Group the matched reviews and calculate:
      // - avgRating: the average of all "rating" values
      // - count: the total number of reviews
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Step 2: Extract the calculated average and count from the aggregation result
    // Use default values (0) if there are no reviews yet
    const avgRating = stats[0]?.avgRating || 0; // Average rating for the product
    const totalReviews = stats[0]?.count || 0; // Total number of reviews

    // Step 3: Update the product document atomically
    // We update the averageRating and totalReviews fields in one operation
    // This ensures that even if multiple reviews are submitted at the same time,
    // the product's stats remain consistent.
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, // Which product to update
      { averageRating: avgRating, totalReviews }, // Fields to update
      { new: true, runValidators: true } // Return the updated document and validate the data
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Ownership authorization check
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Get product ID before deleting for rating recalculation
    const productId = review.productId;

    await Review.findByIdAndDelete(reviewId);

    // Recalculate product rating
    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats[0]?.avgRating || 0;
    const totalReviews = stats[0]?.count || 0;

    await Product.findByIdAndUpdate(
      productId,
      { averageRating: avgRating, totalReviews },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getReviewsByProduct(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const reviews = await Review.find({ productId })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error in getReviewsByProduct controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
