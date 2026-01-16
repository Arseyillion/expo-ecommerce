import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

// FORMER CODE NOT DESIGNED TO HANDLE STRIPE 500 CHARACTER LIMIT ON METADATA FIELDS
// export async function createPaymentIntent(req, res) {
//   try {
//     const { cartItems, shippingAddress } = req.body;
//     const user = req.user;

//     // Validate cart items
//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ error: "Cart is empty" });
//     }

//     // Calculate total from server-side (don't trust client - ever.)
//     let subtotal = 0;
//     const validatedItems = [];

//     for (const item of cartItems) {
//       const product = await Product.findById(item.product._id);
//       if (!product) {
//         return res.status(404).json({ error: `Product ${item.product.name} not found` });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
//       }

//       subtotal += product.price * item.quantity;
//       validatedItems.push({
//         product: product._id.toString(),
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         image: product.images[0],
//       });
//     }

//     const shipping = 10.0; // $10
//     const tax = subtotal * 0.08; // 8%
//     const total = subtotal + shipping + tax;

//     if (total <= 0) {
//       return res.status(400).json({ error: "Invalid order total" });
//     }

//     // find or create the stripe customer
//     let customer;
//     if (user.stripeCustomerId) {
//       // find the customer
//       customer = await stripe.customers.retrieve(user.stripeCustomerId);
//     } else {
//       // create the customer
//       customer = await stripe.customers.create({
//         email: user.email,
//         name: user.name,
//         metadata: {
//           clerkId: user.clerkId,
//           userId: user._id.toString(),
//         },
//       });

//       // add the stripe customer ID to the  user object in the DB
//       await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
//     }

//     // create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(total * 100), // convert to cents
//       currency: "usd",
//       customer: customer.id,
//       automatic_payment_methods: {
//         enabled: true,
//       },
//       metadata: {
//         clerkId: user.clerkId,
//         userId: user._id.toString(),
//         orderItems: JSON.stringify(validatedItems),
//         shippingAddress: JSON.stringify(shippingAddress),
//         totalPrice: total.toFixed(2),
//       },
//       // in the webhooks section we will use this metadata
//     });

//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ error: "Failed to create payment intent" });
//   }
// }

// NEW CODE TO HANDLE STRIPE 500 CHARACTER LIMIT ON METADATA FIELDS

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product?.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shipping = 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    // ─────────────────────────────────────────────
    // Stripe customer
    // ─────────────────────────────────────────────
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });
    }

    // ─────────────────────────────────────────────
    // Metadata size-safe construction
    // ─────────────────────────────────────────────

    const fullItemsJSON = JSON.stringify(validatedItems);

    // Compact summary: productId:qty,productId:qty
    const compactItems = validatedItems
      .map(i => `${i.productId}:${i.quantity}`)
      .join(",");

    const metadata = {
      clerkId: user.clerkId,
      userId: user._id.toString(),
      totalPrice: total.toFixed(2),
    };

    // Prefer full JSON only if it fits
    if (fullItemsJSON.length <= 450) {
      metadata.orderItems = fullItemsJSON;
    } else {
      metadata.orderSummary = compactItems;
    }

    // Log metadata sizes (debugging only)
    console.log("[payment] metadata sizes", {
      fullItemsJSON: fullItemsJSON.length,
      compactItems: compactItems.length,
    });

    // ─────────────────────────────────────────────
    // Create Payment Intent
    // ─────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("[payment] createPaymentIntent failed", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}


export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("Payment succeeded:", paymentIntent.id);

    try {
      const { userId, clerkId, orderItems, shippingAddress, totalPrice } = paymentIntent.metadata;

      // Check if order already exists (prevent duplicates)
      const existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id });
      if (existingOrder) {
        console.log("Order already exists for payment:", paymentIntent.id);
        return res.json({ received: true });
      }

      // create order
      const order = await Order.create({
        user: userId,
        clerkId,
        orderItems: JSON.parse(orderItems),
        shippingAddress: JSON.parse(shippingAddress),
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        totalPrice: parseFloat(totalPrice),
      });

      // update product stock
      const items = JSON.parse(orderItems);
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      console.log("Order created successfully:", order._id);
    } catch (error) {
      console.error("Error creating order from webhook:", error);
    }
  }

  res.json({ received: true });
}
