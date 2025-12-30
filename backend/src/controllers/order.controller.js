import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";
import mongoose from "mongoose";

export async function createOrder(req, res) {
  /**
   * A session allows MongoDB to group multiple operations
   * into a single transaction.
   * Either ALL of them succeed, or ALL of them fail.
   */
  const session = await mongoose.startSession();

  /**
   * Start the transaction.
   * Nothing is permanently saved until we commit.
   */
  session.startTransaction();

  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    /**
     * STEP 1: Validate stock AND reduce it at the same time.
     *
     * findOneAndUpdate does two important things here:
     * 1. It checks that stock is >= quantity
     * 2. It decrements stock in the same database operation
     *
     * This prevents race conditions where two users
     * try to buy the last item at the same time.
     */
    for (const item of orderItems) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity }, // only allow if enough stock
        },
        {
          $inc: { stock: -item.quantity }, // reduce stock
        },
        {
          session, // tie this operation to the transaction
          new: true,
        }
      );

      /**
       * If no product was returned:
       * - product doesn't exist OR
       * - stock was not enough
       *
       * In that case, we cancel the entire transaction.
       */
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock or product not found for ${item.name}`,
        });
      }
    }

    /**
     * STEP 2: Create the order inside the same transaction.
     *
     * We pass an array because MongoDB requires it
     * when creating documents inside a session.
     */
    const order = await Order.create(
      [
        {
          user: user._id,
          clerkId: user.clerkId,
          orderItems,
          shippingAddress,
          paymentResult,
          totalPrice,
        },
      ],
      { session }
    );

    /**
     * STEP 3: Commit the transaction.
     *
     * At this point:
     * - stock updates are saved
     * - order is saved
     *
     * If we never reach this line, nothing is persisted.
     */
    await session.commitTransaction();

    res.status(201).json({
      message: "Order created successfully",
      order: order[0], // because Order.create returned an array
    });
  } catch (error) {
    /**
     * If ANY error happens above,
     * roll back everything.
     */
    await session.abortTransaction();
    console.error("Error in createOrder controller:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    /**
     * Always close the session.
     * This runs whether we succeed or fail.
     */
    session.endSession();
  }
}


export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // check if each order has been reviewed

    const orderIds = orders.map((order) => order._id);
    const reviews = await Review.find({ orderId: { $in: orderIds } });
    const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()));

    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        return {
          ...order.toObject(),
          hasReviewed: reviewedOrderIds.has(order._id.toString()),
        };
      })
    );

    res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
