import { Router } from "express";
import { getAllProducts } from "../controllers/admin.controller.js";
import { getProductById, getNewArrivals } from "../controllers/product.controller.js";

const router = Router();

// Public product listing endpoints
router.get("/", getAllProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/:id", getProductById);

export default router;
