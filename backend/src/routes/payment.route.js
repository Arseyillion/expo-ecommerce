import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { createFlutterwavePaymentIntent, verifyFlutterwavePayment } from "../controllers/flutter.payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);
router.post("/create-flutterwave-intent", protectRoute, createFlutterwavePaymentIntent);
router.get("/verify/:id", verifyFlutterwavePayment);

// Note: webhook route is handled directly in server.js with raw body parsing
// to ensure proper signature verification from Stripe

export default router;
