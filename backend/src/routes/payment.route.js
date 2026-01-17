import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);

// Note: webhook route is handled directly in server.js with raw body parsing
// to ensure proper signature verification from Stripe

export default router;
