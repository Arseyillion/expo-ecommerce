import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import { syncUser, deleteUserFromDB } from "./config/inngest.js";

// Compute __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import carouselRoutes from "./routes/carousel.route.js";
import cartRoutes from "./routes/cart.route.js";
import promoBannerRoutes from "./routes/promoBanner.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import { handleWebhook } from "./controllers/payment.controller.js";

import cors from "cors";  

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173','http://localhost:3001'], // Frontend and admin panel
  credentials: true, // Allow cookies for authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// CRITICAL: Raw body parser for Stripe webhook MUST come before JSON parser
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

//makes it possible to handle json data in the request body
app.use(express.json());

//makes it possible to handle form data (urlencoded) from admin panel
app.use(express.urlencoded({ extended: true }));

// Serve static files from Next.js public folder in development
if (ENV.NODE_ENV !== "production") {
  app.use("/images", express.static(path.join(__dirname, "../../nextjs-ecommerce-template/public/images")));
}

app.use(clerkMiddleware()); // adds auth object to request

// Mount payment routes for other endpoints
app.use("/api/payment", paymentRoutes);


// we got this from inngest documentation so there's no need to try to know it by heart
app.use(
  "/api/inngest",
  serve({ client: inngest, functions:[ syncUser, deleteUserFromDB], streaming: "force", }),
);

app.use("/api/admin",adminRoutes)
app.use("/api/users",userRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/carousels", carouselRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/promo-banners", promoBannerRoutes);



app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

// Add development root route
// app.get("/", (req, res) => {
//   res.status(200).json({ 
//     message: "Backend API is running",
//     api: "http://localhost:3001/api",
//     admin: "Run 'npm run dev' in admin folder (port 5173)",
//     frontend: "Run 'npm run dev' in nextjs-ecommerce-template folder (port 3000)"
//   });
// });

// make our app ready forz deployment
if (ENV.NODE_ENV === "production") {
  // In production, serve admin panel from project root (where it's actually built)
  app.use(express.static(path.join(__dirname, "../../admin/dist")));

  // if we visit any routes other than our api routes we would like to see our application
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../admin/dist", "index.html"));
  });
} else {
  // In development, only serve API routes - admin panel should be run separately
  console.log("Running in development mode - admin panel should be run separately with 'npm run dev' in admin folder");
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server is up and running on port ${ENV.PORT}`);
    console.log(`Backend API: http://localhost:${ENV.PORT}/api`);
  });
};

startServer();
