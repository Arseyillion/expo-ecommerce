import { Product } from "../models/product.model.js";

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// THE SECOND FUNCTION getAllProducts FOR THIS ROUTE IS DEFINED IN the file admin.controller.js

export async function getNewArrivals(req, res) {
  try {
    // limit the number returned to 8 by default (can be expanded later)
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}