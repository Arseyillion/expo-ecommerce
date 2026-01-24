import { Router } from "express";
import {
  createProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createCarousel,
  getAllCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel,
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// optimization - DRY always call the protectRoute and adminOnly middlewares for all routes in this file
router.use(protectRoute, adminOnly);

// 3 images per product maximum that is what the upload.array("images", 3) is doing
router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
// we might want to update product images as well
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

// Category management routes
router.post("/categories", upload.single("image"), createCategory);
router.get("/categories", getAllCategories);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

// Carousel management routes
router.post("/carousels", upload.fields([{ name: 'slide0Image', maxCount: 1 }, { name: 'slide1Image', maxCount: 1 }, { name: 'slide2Image', maxCount: 1 }, { name: 'slide3Image', maxCount: 1 }, { name: 'slide4Image', maxCount: 1 }]), createCarousel);
router.get("/carousels", getAllCarousels);
router.get("/carousels/:id", getCarouselById);
router.put("/carousels/:id", upload.fields([{ name: 'slide0Image', maxCount: 1 }, { name: 'slide1Image', maxCount: 1 }, { name: 'slide2Image', maxCount: 1 }, { name: 'slide3Image', maxCount: 1 }, { name: 'slide4Image', maxCount: 1 }]), updateCarousel);
router.delete("/carousels/:id", deleteCarousel);

// PUT: Used for full resource replacement, updating the entire resource
// PATCH: Used for partial resource updates, updating a specific part of the resource

export default router;
