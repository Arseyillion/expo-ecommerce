import cloudinary from "../config/cloudinary";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { Carousel } from "../models/carousel.model.js";

// we installed multer package to handle file uploads in express
export async function createProduct(req, res) { 
    // Implementation for creating a product
    try {
        console.log("🔄 Starting product creation process");
        const { name, description, price, stock, category, isNewArrival, discount } = req.body;
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
        const parsedDiscount = discount ? parseFloat(discount) : 0;
        console.log("🔢 Parsed values:", { parsedPrice, parsedStock, parsedDiscount });

        if(isNaN(parsedPrice) ){
            return res.status(400).json({message:"invalid price value"})
        }     
        
        if(isNaN(parsedStock)){
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
          isNewArrival: Boolean(isNewArrival),
          discount: parsedDiscount,
        });
        console.log("✅ Product created successfully:", product._id);

        return res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("❌ Error creating product:", error);
        return res.status(500).json({ message: "Server error, Failed to create product", error: error.message });
    }
}

export async function getAllProducts(req, res) {
    // Implementation for getting all products with pagination
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Get total count of products
        const totalProducts = await Product.countDocuments();
        
        // Get products with pagination
        const products = await Product.find()
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalProducts / limit);

        return res.status(200).json({ 
            products,
            pagination: {
                page,
                limit,
                total: totalProducts,
                totalPages
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Server error, Failed to fetch products", error: error.message });
    }
}

export async function updateProduct(req, res) { 
    // Implementation for updating a product
    try {
        console.log("🔄 Starting product update process");
        console.log("📝 Request params:", req.params);
        console.log("📝 Request body type:", typeof req.body);
        console.log("📝 Request body keys:", Object.keys(req.body));
        console.log("📝 Request body:", req.body);
        console.log("📝 Request files:", req.files);
        
        const { id } = req.params;
        const { name, description, price, stock, category, isNewArrival, discount } = req.body;
        
        console.log("📋 Extracted form data:", { 
            id, 
            name, 
            description, 
            price, 
            stock, 
            category, 
            isNewArrival, 
            discount 
        });

        const product = await Product.findById(id);
        if (!product) {
            console.log("❌ Product not found with ID:", id);
            return res.status(404).json({ message: "Product not found" });
        }
        
        console.log("📦 Found product:", {
            name: product.name,
            currentPrice: product.price,
            currentDiscount: product.discount,
            currentHasDiscount: product.hasDiscount,
            currentDiscountedPrice: product.discountedPrice
        });

        // Update fields if they are provided in the request body
        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;
        if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
        
        if (discount !== undefined) {
            console.log("💰 Updating discount field. Original discount:", product.discount, "New discount:", discount);
            product.discount = parseFloat(discount);
            // Calculate discounted price and hasDiscount flag
            if (product.discount > 0) {
                product.discountedPrice = product.price * (1 - product.discount / 100);
                product.hasDiscount = true;
                console.log("✅ Applied discount:", {
                    discount: product.discount,
                    originalPrice: product.price,
                    discountedPrice: product.discountedPrice,
                    hasDiscount: product.hasDiscount
                });
            } else {
                product.discountedPrice = product.price;
                product.hasDiscount = false;
                console.log("❌ Removed discount:", {
                    discount: product.discount,
                    originalPrice: product.price,
                    discountedPrice: product.discountedPrice,
                    hasDiscount: product.hasDiscount
                });
            }
        } else {
            console.log("⚠️ Discount field not provided in request");
        }

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

        console.log("💾 Saving product to database...");
        await product.save();
        console.log("✅ Product saved successfully!");

        console.log("📋 Final product state:", {
            name: product.name,
            price: product.price,
            discount: product.discount,
            hasDiscount: product.hasDiscount,
            discountedPrice: product.discountedPrice
        });

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("❌ Error updating product:", error);
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

// Category Management Functions
export async function createCategory(req, res) {
  try {
    console.log("🔄 Starting category creation process");
    const { name, description, order } = req.body;
    console.log("📝 Extracted form data:", { name, description, order });

    if (!name) {
      console.log("❌ Validation failed: Missing category name");
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!req.file) {
      console.log("❌ Validation failed: No image provided");
      return res.status(400).json({ message: "Category image is required" });
    }

    console.log("☁️ Starting Cloudinary upload");
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'ecommerce/categories',
      resource_type: 'image'
    });
    console.log("✅ Cloudinary upload successful");

    const category = await Category.create({
      name,
      description,
      image: uploadResult.secure_url,
      order: order ? parseInt(order) : 0,
    });
    console.log("✅ Category created successfully:", category._id);

    return res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("❌ Error creating category:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    return res.status(500).json({ message: "Server error, Failed to create category", error: error.message });
  }
}

export async function getAllCategories(_, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Server error, Failed to fetch categories", error: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update fields if they are provided
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = parseInt(order);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    // Handle image update if new image is provided
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'ecommerce/categories',
        resource_type: 'image'
      });
      
      // Delete old image from Cloudinary
      if (category.image) {
        const publicId = "categories/" + category.image.split("/categories/")[1]?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
      
      category.image = uploadResult.secure_url;
    }

    await category.save();
    return res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    return res.status(500).json({ message: "Server error, Failed to update category", error: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category is being used by any products
    const productsUsingCategory = await Product.countDocuments({ category: category.name });
    if (productsUsingCategory > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category. It is being used by " + productsUsingCategory + " products. Please reassign or delete those products first." 
      });
    }

    // Delete image from Cloudinary
    if (category.image) {
      const publicId = "categories/" + category.image.split("/categories/")[1]?.split(".")[0];
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
}

// Carousel Management Functions
export async function createCarousel(req, res) {
  try {
    console.log("🔄 Starting carousel creation process");
    const { name, description, slides, autoplayDelay, spaceBetween, centeredSlides } = req.body;
    console.log("📝 Extracted form data:", { name, description, slidesCount: slides?.length });

    if (!name) {
      console.log("❌ Validation failed: Missing carousel name");
      return res.status(400).json({ message: "Carousel name is required" });
    }

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      console.log("❌ Validation failed: Missing or invalid slides");
      return res.status(400).json({ message: "At least one slide is required" });
    }

    // Process slide images
    const processedSlides = [];
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      if (!req.files || !req.files[`slide${i}Image`] || !req.files[`slide${i}Image`][0]) {
        console.log(`❌ Validation failed: Missing image for slide ${i}`);
        return res.status(400).json({ message: `Image is required for slide ${i + 1}` });
      }

      const imageFile = req.files[`slide${i}Image`][0];
      console.log(`☁️ Starting Cloudinary upload for slide ${i}`);
      
      const b64 = Buffer.from(imageFile.buffer).toString('base64');
      const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
      
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'ecommerce/carousel',
        resource_type: 'image'
      });
      console.log(`✅ Cloudinary upload successful for slide ${i}`);

      processedSlides.push({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        discountPercentage: slide.discountPercentage || "30%",
        discountText: slide.discountText || "Sale Off",
        buttonText: slide.buttonText || "Shop Now",
        buttonLink: slide.buttonLink || "#",
        image: uploadResult.secure_url,
        order: slide.order || i,
        isActive: slide.isActive !== false,
      });
    }

    const carousel = await Carousel.create({
      name,
      description,
      slides: processedSlides,
      autoplayDelay: autoplayDelay ? parseInt(autoplayDelay) : 2500,
      spaceBetween: spaceBetween ? parseInt(spaceBetween) : 30,
      centeredSlides: centeredSlides !== false,
    });
    console.log("✅ Carousel created successfully:", carousel._id);

    return res.status(201).json({ message: "Carousel created successfully", carousel });
  } catch (error) {
    console.error("❌ Error creating carousel:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Carousel name already exists" });
    }
    return res.status(500).json({ message: "Server error, Failed to create carousel", error: error.message });
  }
}

export async function getAllCarousels(_, res) {
  try {
    const carousels = await Carousel.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({ carousels });
  } catch (error) {
    console.error("Error fetching carousels:", error);
    return res.status(500).json({ message: "Server error, Failed to fetch carousels", error: error.message });
  }
}

export async function getCarouselById(req, res) {
  try {
    const { id } = req.params;
    const carousel = await Carousel.findById(id);
    
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    return res.status(200).json({ carousel });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return res.status(500).json({ message: "Server error, Failed to fetch carousel", error: error.message });
  }
}

export async function updateCarousel(req, res) {
  try {
    console.log("🔄 Starting carousel update process");
    console.log("📝 Request body:", req.body);
    console.log("📁 Request files:", req.files ? Object.keys(req.files) : "No files");
    
    const { id } = req.params;
    const { name, description, slides, autoplayDelay, spaceBetween, centeredSlides, isActive } = req.body;

    console.log("📋 Extracted form data:", { name, description, slidesCount: slides?.length, autoplayDelay, spaceBetween, centeredSlides, isActive });

    const carousel = await Carousel.findById(id);
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    // Update basic fields
    if (name) carousel.name = name;
    if (description !== undefined) carousel.description = description;
    if (autoplayDelay !== undefined) carousel.autoplayDelay = parseInt(autoplayDelay);
    if (spaceBetween !== undefined) carousel.spaceBetween = parseInt(spaceBetween);
    if (centeredSlides !== undefined) carousel.centeredSlides = Boolean(centeredSlides);
    if (isActive !== undefined) carousel.isActive = Boolean(isActive);

    // Update slides if provided
    if (slides) {
      let parsedSlides;
      
      // Parse slides if it's a string (from FormData)
      if (typeof slides === 'string') {
        try {
          parsedSlides = JSON.parse(slides);
          console.log("✅ Successfully parsed slides from string:", parsedSlides.length, "slides");
        } catch (parseError) {
          console.error("Error parsing slides:", parseError);
          return res.status(400).json({ message: "Invalid slides data format" });
        }
      } else if (Array.isArray(slides)) {
        parsedSlides = slides;
        console.log("✅ Using slides as array:", parsedSlides.length, "slides");
      } else {
        return res.status(400).json({ message: "Slides must be an array" });
      }

      if (Array.isArray(parsedSlides)) {
        const processedSlides = [];
        
        for (let i = 0; i < parsedSlides.length; i++) {
          const slide = parsedSlides[i];
          let imageUrl = slide.image; // Keep existing image by default
          
          console.log(`🖼️ Processing slide ${i}:`, { title: slide.title, hasNewImage: !!req.files?.[`slide${i}Image`] });
          
          // Check if new image is uploaded for this slide
          if (req.files && req.files[`slide${i}Image`] && req.files[`slide${i}Image`][0]) {
            const imageFile = req.files[`slide${i}Image`][0];
            
            console.log(`☁️ Starting Cloudinary upload for slide ${i}`);
            
            // Delete old image from Cloudinary if it exists
            if (slide.image) {
              const publicId = "carousel/" + slide.image.split("/carousel/")[1]?.split(".")[0];
              if (publicId) {
                console.log(`🗑️ Deleting old image: ${publicId}`);
                await cloudinary.uploader.destroy(publicId);
              }
            }
            
            // Upload new image
            const b64 = Buffer.from(imageFile.buffer).toString('base64');
            const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
            
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
              folder: 'ecommerce/carousel',
              resource_type: 'image'
            });
            
            imageUrl = uploadResult.secure_url;
            console.log(`✅ Cloudinary upload successful for slide ${i}: ${imageUrl}`);
          }
          
          processedSlides.push({
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            discountPercentage: slide.discountPercentage || "30%",
            discountText: slide.discountText || "Sale Off",
            buttonText: slide.buttonText || "Shop Now",
            buttonLink: slide.buttonLink || "#",
            image: imageUrl,
            order: slide.order !== undefined ? parseInt(slide.order) : i,
            isActive: slide.isActive !== false,
          });
        }
        
        carousel.slides = processedSlides;
        console.log("📊 Final processed slides:", processedSlides.length);
      }
    }

    await carousel.save();
    console.log("✅ Carousel updated successfully:", carousel._id);
    return res.status(200).json({ message: "Carousel updated successfully", carousel });
  } catch (error) {
    console.error("❌ Error updating carousel:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Carousel name already exists" });
    }
    return res.status(500).json({ message: "Server error, Failed to update carousel", error: error.message });
  }
}

export async function deleteCarousel(req, res) {
  try {
    const { id } = req.params;

    const carousel = await Carousel.findById(id);
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    // Delete all slide images from Cloudinary
    if (carousel.slides && carousel.slides.length > 0) {
      const deletePromises = carousel.slides.map((slide) => {
        if (slide.image) {
          const publicId = "carousel/" + slide.image.split("/carousel/")[1]?.split(".")[0];
          if (publicId) return cloudinary.uploader.destroy(publicId);
        }
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await Carousel.findByIdAndDelete(id);
    res.status(200).json({ message: "Carousel deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel:", error);
    res.status(500).json({ message: "Failed to delete carousel" });
  }
}

// Public carousel functions
export async function getActiveCarousel(req, res) {
  try {
    const carousel = await Carousel.findOne({ isActive: true }).sort({ createdAt: 1 });
    
    if (!carousel) {
      return res.status(404).json({ message: "No active carousel found" });
    }

    return res.status(200).json({ carousel });
  } catch (error) {
    console.error("Error fetching active carousel:", error);
    return res.status(500).json({ message: "Server error, Failed to fetch active carousel", error: error.message });
  }
}
