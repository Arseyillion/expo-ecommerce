import express from "express";
import {
    createPromoBanner,
    getActivePromoBanners,
    getAllPromoBanners,
    getPromoBannerById,
    updatePromoBanner,
    deletePromoBanner,
    togglePromoBanner
} from "../controllers/promoBanner.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActivePromoBanners);
router.get("/:id", getPromoBannerById);

// Admin routes - protected with authentication and admin-only access
router.post("/", protectRoute, adminOnly, createPromoBanner);
router.get("/", protectRoute, adminOnly, getAllPromoBanners);
router.put("/:id", protectRoute, adminOnly, updatePromoBanner);
router.delete("/:id", protectRoute, adminOnly, deletePromoBanner);
router.patch("/:id/toggle", protectRoute, adminOnly, togglePromoBanner);

export default router;
