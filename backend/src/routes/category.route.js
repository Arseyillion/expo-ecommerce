import { Router } from "express";
import { getAllCategories } from "../controllers/admin.controller.js";

const router = Router();

// Public category endpoints
router.get("/", getAllCategories);

export default router;
