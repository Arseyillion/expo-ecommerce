import { Router } from "express";
import { getCarouselById, getActiveCarousel } from "../controllers/admin.controller.js";

const router = Router();

// Public carousel endpoints
router.get("/active", getActiveCarousel);
router.get("/:id", getCarouselById);

export default router;
