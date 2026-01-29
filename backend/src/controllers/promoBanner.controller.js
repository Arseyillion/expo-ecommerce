import { PromoBanner } from "../models/promoBanner.model.js";
import cloudinary from "../config/cloudinary.js";

// Create a new promo banner
export const createPromoBanner = async (req, res) => {
    try {
        const { title, description, link, buttonText, priority, isActive, startDate, endDate } = req.body;
        
        let imageUrl = null;
        
        // Handle image upload if provided
        if (req.file) {
            console.log("☁️ Starting Cloudinary upload for promo banner");
            
            // Convert the file buffer to base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'ecommerce/promo-banners',
                resource_type: 'image'
            });
            
            console.log("✅ Cloudinary upload successful");
            imageUrl = uploadResult.secure_url;
        }
        
        // Create promo banner with image URL
        const promoBanner = new PromoBanner({
            title,
            description,
            image: imageUrl,
            link,
            buttonText,
            priority: priority ? parseInt(priority) : 0,
            isActive: isActive !== false, // Default to true if not specified
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        
        await promoBanner.save();
        res.status(201).json({
            success: true,
            message: "Promo banner created successfully",
            data: promoBanner
        });
    } catch (error) {
        console.error("Error creating promo banner:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all active promo banners
export const getActivePromoBanners = async (req, res) => {
    try {
        const now = new Date();
        const banners = await PromoBanner.find({
            isActive: true,
            $and: [
                {
                    $or: [
                        { startDate: { $exists: false } },
                        { startDate: { $lte: now } }
                    ]
                },
                {
                    $or: [
                        { endDate: { $exists: false } },
                        { endDate: { $gt: now } }
                    ]
                }
            ]
        }).sort({ priority: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all promo banners (including inactive)
export const getAllPromoBanners = async (req, res) => {
    try {
        const banners = await PromoBanner.find({}).sort({ priority: -1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single promo banner
export const getPromoBannerById = async (req, res) => {
    try {
        const banner = await PromoBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Promo banner not found"
            });
        }
        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update promo banner
export const updatePromoBanner = async (req, res) => {
    try {
        const { title, description, link, buttonText, priority, isActive, startDate, endDate } = req.body;
        
        // Find existing banner
        const banner = await PromoBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Promo banner not found"
            });
        }
        
        // Handle image update if new image is provided
        if (req.file) {
            console.log("☁️ Starting Cloudinary upload for updated promo banner");
            
            // Delete old image from Cloudinary if it exists
            if (banner.image) {
                const publicId = "promo-banners/" + banner.image.split("/promo-banners/")[1]?.split(".")[0];
                if (publicId) {
                    console.log("🗑️ Deleting old image:", publicId);
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            
            // Upload new image
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'ecommerce/promo-banners',
                resource_type: 'image'
            });
            
            console.log("✅ Cloudinary upload successful");
            banner.image = uploadResult.secure_url;
        }
        
        // Update other fields
        if (title !== undefined) banner.title = title;
        if (description !== undefined) banner.description = description;
        if (link !== undefined) banner.link = link;
        if (buttonText !== undefined) banner.buttonText = buttonText;
        if (priority !== undefined) banner.priority = parseInt(priority);
        if (isActive !== undefined) banner.isActive = isActive;
        if (startDate !== undefined) banner.startDate = new Date(startDate);
        if (endDate !== undefined) banner.endDate = new Date(endDate);
        
        await banner.save();
        res.status(200).json({
            success: true,
            message: "Promo banner updated successfully",
            data: banner
        });
    } catch (error) {
        console.error("Error updating promo banner:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete promo banner
export const deletePromoBanner = async (req, res) => {
    try {
        const banner = await PromoBanner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Promo banner not found"
            });
        }
        
        // Delete image from Cloudinary if it exists
        if (banner.image) {
            const publicId = "promo-banners/" + banner.image.split("/promo-banners/")[1]?.split(".")[0];
            if (publicId) {
                console.log("🗑️ Deleting image from Cloudinary:", publicId);
                await cloudinary.uploader.destroy(publicId);
            }
        }
        
        res.status(200).json({
            success: true,
            message: "Promo banner deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting promo banner:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Toggle banner active status
export const togglePromoBanner = async (req, res) => {
    try {
        const banner = await PromoBanner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Promo banner not found"
            });
        }
        banner.isActive = !banner.isActive;
        await banner.save();
        res.status(200).json({
            success: true,
            message: `Promo banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
            data: banner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
