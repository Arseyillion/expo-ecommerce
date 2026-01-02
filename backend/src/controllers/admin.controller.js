import cloudinary from "../config/cloudinary";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

// we installed multer package to handle file uploads in express
export async function createProduct(req, res) { 
    // Implementation for creating a product
    try {
        console.log("🔄 Starting product creation process");
        const { name, description, price, stock, category } = req.body;
        console.log("📝 Extracted form data:", { name, description, price, stock, category });

        // if not all fields are provided
        if(!name || !description || !price || !stock || !category){
            console.log("❌ Validation failed: Missing required fields");
            // throw an error
            return res.status(400).json({message:"All fields are required"})
        }
        console.log("✅ Form validation passed");

        // if no images are provided
        if (!req.files || req.files.length === 0) {
            console.log("❌ Validation failed: No images provided");
            // throw an error
            return res.status(400).json({ message: "At least one image is required" });
        }

        if(req.files.length > 3){
            console.log("❌ Validation failed: Too many images", req.files.length);
            return res.status(400).json({message:"You can upload a maximum of 3 images"})
        }
        console.log("✅ Image validation passed, files count:", req.files.length);

        console.log("☁️ Starting Cloudinary upload");
        const uploadPromises = req.files.map((file) => {
            // Convert the file buffer (raw binary data from memory storage) to a base64 encoded string
            // Buffer.from(file.buffer) creates a Buffer from the uploaded file's binary data
            // .toString('base64') converts that binary data to a base64 encoded string representation
            const b64 = Buffer.from(file.buffer).toString('base64');
            
            // Create a Data URI (Uniform Resource Identifier) that embeds the base64 data directly
            // Format: data:{mimetype};base64,{base64data}
            // This allows Cloudinary to receive the image data as a string instead of a file path
            // file.mimetype contains the MIME type (e.g., 'image/jpeg', 'image/png')
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            
            // Upload the dataURI to Cloudinary
            // This approach works with memory storage (no temp files) and provides the image data directly
            return cloudinary.uploader.upload(dataURI, {
                folder: 'ecommerce/products',
                resource_type: 'image'
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        console.log("✅ Cloudinary upload successful, results count:", uploadResults.length);

        // Now you can use uploadResults which contains the details of the uploaded images
        // For example, you might want to save the URLs in your database

        const imageUrls = uploadResults.map(result => result.secure_url);
        console.log("🖼️ Extracted image URLs:", imageUrls);

        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock);
        console.log("🔢 Parsed values:", { parsedPrice, parsedStock });

        if(isNaN(parsedPrice) || isNaN(parsedStock)){
            console.log("❌ Parsing failed: Invalid price or stock");
            return res.status(400).json({message:"invalid price value"})
        }     
        
        if(isNaN(parsedStock)){
            console.log("❌ Parsing failed: Invalid stock");
            return res.status(400).json({message:"invalid stock value"})
        }
        console.log("✅ Value parsing passed");

        console.log("💾 Creating product in database");
        const product = await Product.create({
            name,
            description,
            price:parsedPrice,
            stock:parsedStock,
            category,
            images:imageUrls,
        });
        console.log("✅ Product created successfully:", product._id);

        return res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("❌ Error creating product:", error);
        return res.status(500).json({ message: "Server error, Failed to create product", error: error.message });
    }
}

export async function getAllProducts(_, res) {
    // Implementation for getting all products
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // Sort by creation date in descending order, which means latest products first
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Server error, Failed to fetch products", error: error.message });
    }
}

export async function updateProduct(req, res) { 
    // Implementation for updating a product
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields if they are provided in the request body
        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

        // Handle image updates if new images are provided
        if (req.files && req.files.length > 0) {
            if(req.files.length > 3){
                return res.status(400).json({message:"You can upload a maximum of 3 images"})
            }

            const uploadPromises = req.files.map((file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                
                return cloudinary.uploader.upload(dataURI, {
                    folder: 'ecommerce/products',
                    resource_type: 'image'
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map(result => result.secure_url);
            product.images = imageUrls; // Replace old images with new ones
        }

        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Server error, Failed to update product", error: error.message });
    }
}

export async function getAllOrders(_, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });

  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 }); // latest user first
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        // Extract public_id from URL (assumes format: .../products/publicId.ext)
        const publicId = "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
