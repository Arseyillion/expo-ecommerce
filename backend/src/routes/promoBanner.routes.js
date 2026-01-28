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

const router = express.Router();

// Public routes
router.get("/active", getActivePromoBanners);
router.get("/:id", getPromoBannerById);

// Admin routes (add authentication middleware as needed)
router.post("/", createPromoBanner);
router.get("/", getAllPromoBanners);
router.put("/:id", updatePromoBanner);
router.delete("/:id", deletePromoBanner);
router.patch("/:id/toggle", togglePromoBanner);

export default router;
