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
      .map((i) => `${i.productId}:${i.quantity}:${i.price}`)
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

    // Validate compactItems fits within Stripe's 500-char metadata limit
   if (metadata.orderSummary && metadata.orderSummary.length > 500) {
     return res.status(400).json({
       error: "Cart too large to encode in payment metadata",
     });
   }

    // Add shipping address (also subject to 500 char limit)
    if (shippingAddress) {
      const shippingJSON = JSON.stringify(shippingAddress);
      if (shippingJSON.length <= 500) {
        metadata.shippingAddress = shippingJSON;
      } else {
        // Consider storing address ID or truncating if too long
        console.warn("[payment] shippingAddress exceeds metadata limit");
      }
    } else {
      console.warn("[payment] No shippingAddress provided");
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
  console.log("🔔 Stripe webhook hit");

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("❌ Missing Stripe signature header");
    return res.status(400).send("Missing Stripe signature");
  }

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed");
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Event verified");
  console.log("➡️ Event type:", event.type);

  if (event.type !== "payment_intent.succeeded") {
    console.log("ℹ️ Ignoring event:", event.type);
    return res.json({ received: true });
  }

  const paymentIntent = event.data.object;

  console.log("💰 PaymentIntent ID:", paymentIntent.id);
  console.log("📦 Metadata:", paymentIntent.metadata);

  try {
    const {
      userId,
      clerkId,
      orderItems,
      orderSummary,
      shippingAddress,
      totalPrice,
    } = paymentIntent.metadata;

    if (!userId || !clerkId) {
      throw new Error("Missing userId or clerkId in metadata");
    }

    if (!shippingAddress) {
      throw new Error("Missing shippingAddress in metadata");
    }

    const existingOrder = await Order.findOne({
      "paymentResult.id": paymentIntent.id,
    });

    if (existingOrder) {
      console.log("⚠️ Order already exists:", existingOrder._id);
      return res.json({ received: true });
    }

    let parsedItems;

    if (orderItems) {
      parsedItems = JSON.parse(orderItems);
    } else if (orderSummary) {
      parsedItems = await Promise.all(
        orderSummary.split(",").map(async (entry) => {
          const [productId, quantity, price] = entry.split(":");
          const product = price ? null : await Product.findById(productId);

          if (!product && !price) {
            throw new Error(`Product not found: ${productId}`);
          }

          return {
            productId,
            quantity: Number(quantity),
            price: price ? Number(price) : product.price,
          };
        })
      );
    } else {
      throw new Error("No order items provided");
    }

    console.log("🧾 Parsed items:", parsedItems);

    const order = await Order.create({
      user: userId,
      clerkId,
      orderItems: parsedItems,
      shippingAddress: JSON.parse(shippingAddress),
      paymentResult: {
        id: paymentIntent.id,
        status: "succeeded",
      },
      totalPrice: Number(totalPrice),
    });

    console.log("✅ Order created:", order._id);

    for (const item of parsedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    console.log("📉 Stock updated");
  } catch (error) {
    console.error("🔥 Fatal webhook processing error");
    console.error(error);
    return res.status(500).json({ received: false });
  }

  res.json({ received: true });
}

