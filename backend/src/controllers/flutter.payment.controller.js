import axios from "axios";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

// Temporary storage for order data (in production, use Redis or database)
const orderDataStore = new Map();

export async function createFlutterwavePaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    console.log(
      `[flutterwave] createFlutterwavePaymentIntent called with cartItems: ${JSON.stringify(cartItems)}, shippingAddress: ${JSON.stringify(shippingAddress)} for user: ${req.user}`,
    );
    const user = req.user;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ error: "Invalid item quantity" });
      }
      // item.product._id will throw if the client sends product as an ID string or omits it. That yields a 500 instead of a 400. Normalize the product ID before the lookup.
      const productId = item?.product?._id ?? item?.product;
      if (!productId) {
        return res.status(400).json({ error: "Invalid product reference" });
      }
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product?.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemPrice = product.hasDiscount ? product.discountedPrice : product.price;
      validatedItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: itemPrice,
      });
      subtotal += itemPrice;
    }

    const shipping = 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    const txRef = "order-" + Date.now();
    // console.log(`[flutterwave] Creating payment with tx_ref: ${txRef}`);
    // console.log(
    //   `[flutterwave] Redirect URL base: ${process.env.FLUTTER_REDIRECT_URL}`,
    // );

    const enrichedOrderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.product._id);

        if (!product) {
          console.log(`Product not found: ${item.product._id}`);
          throw new Error(`Product not found: ${item.product._id}`);
        }

        return {
          product: product._id,
          name: product.name,
          price: product.hasDiscount ? product.discountedPrice : product.price,
          quantity: item.quantity,
          image: product.images?.[0] || "",
        };
      }),
    );

    const metadata = {
      clerkId: user.clerkId,
      userId: user._id.toString(),
      totalPrice: total.toFixed(2),
    };

    const order = await Order.create({
      user: metadata.userId,
      clerkId: metadata.clerkId,
      orderItems: enrichedOrderItems,
      shippingAddress:shippingAddress,
      paymentResult: {
        id: txRef,
        status: "pending",
      },
      totalPrice: Number(total),
    }).catch(error => {
      // Handle duplicate key error by removing the unique constraint
      if (error.code === 11000 && error.keyPattern?.clerkId) {
        console.log("⚠️ Duplicate clerkId detected, this indicates a unique index constraint needs to be removed");
        throw new Error("Database constraint error: Users should be able to place multiple orders. Please remove the unique index on clerkId field.");
      }
      throw error;
    });

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: txRef,
        amount: total,
        currency: "NGN",
        redirect_url: `${process.env.FLUTTER_REDIRECT_URL}?tx_ref=${txRef}`,
        customer: {
          email: user.email,
          phonenumber: shippingAddress.phoneNumber,
          name: shippingAddress.fullName,
        },
        customizations: {
          title: "Payment for order of electronics being made",
          description: "Payment for order of electronics being made",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    console.log(
      `[flutterwave] Payment creation response:`,
      JSON.stringify(response.data, null, 2),
    );
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("[payment] createPaymentIntent failed", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

export async function verifyFlutterwavePayment(req, res) {
  try {
    const idOrRef = req.params.id;
    const isTxRef = !/^\d+$/.test(idOrRef);

    if (isTxRef) {
      console.log(
        `[flutterwave] Verifying by tx_ref (verify_by_reference): ${idOrRef}`,
      );
    } else {
      console.log(`[flutterwave] Verifying transaction ID: ${idOrRef}`);
    }

    const response = await axios.get(
      isTxRef
        ? "https://api.flutterwave.com/v3/transactions/verify_by_reference"
        : `https://api.flutterwave.com/v3/transactions/${idOrRef}/verify`,
      {
        params: isTxRef ? { tx_ref: idOrRef } : undefined,
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    console.log(`[flutterwave] Verification successful:`, response.data);

    // Check if payment was successful and create order
    if (response.data.status === "success") {
      const paymentData = response.data.data;

      // if payment is successful, 
      // find that particular order and update order payment status and change payment status of pending to success else delete that order
      if (paymentData.status === "successful") {
        try {
          // Find the order with this transaction reference (stored as paymentResult.id during creation)
          const order = await Order.findOne({ 
            "paymentResult.id": paymentData.tx_ref 
          });

          if (order) {
            // Update payment status from pending to successful
            await Order.findByIdAndUpdate(order._id, {
              "paymentResult.status": "succeeded"
            });

            console.log(`[flutterwave] Order ${order._id} payment status updated to successful`);

            // Update product stock (only once when payment is confirmed)
            for (const item of order.orderItems) {
              const stockUpdateResult = await Product.updateOne(
                { 
                  _id: item.product, 
                  stock: { $gte: item.quantity }
                },
                { 
                  $inc: { stock: -item.quantity }
                }
              );
              
              if (stockUpdateResult.modifiedCount === 0) {
                console.error(`[flutterwave] Stock update failed for product ${item.product}: insufficient stock or product not found`);
                return res.status(400).json({ 
                  success: false, 
                  message: 'Insufficient stock for one or more items',
                  error: `Product ${item.product} stock update failed - insufficient stock` 
                });
              }
            }

            console.log(`[flutterwave] Product stock updated for order ${order._id}`);

            // Clear user's cart
            await Cart.findOneAndUpdate(
              { user: order.user },
              { items: [] },
              { new: true },
            );

            console.log(`[flutterwave] Cart cleared for user: ${order.user}`);
          } else {
            console.warn(`[flutterwave] No order found with transaction ID: ${paymentData.id}`);
          }
        } catch (updateError) {
          console.error(`[flutterwave] Error updating order:`, updateError);
          return res.status(500).json({ 
            success: false, 
            message: 'Order update failed', 
            error: updateError.message 
          });
        }
      }
    }

    res.json(response.data);
  } catch (error) {
    console.error("Flutterwave verification error:", error);

    // Log detailed error information
    if (error.response) {
      console.error("Flutterwave API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }

    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: "Failed to verify Flutterwave payment",
      message: error.response?.data?.message || error.message,
      data: error.response?.data || null,
    });
  }
}
