import { PromoBanner } from "../models/promoBanner.model.js";

// Create a new promo banner
export const createPromoBanner = async (req, res) => {
    try {
        const promoBanner = new PromoBanner(req.body);
        await promoBanner.save();
        res.status(201).json({
            success: true,
            message: "Promo banner created successfully",
            data: promoBanner
        });
    } catch (error) {
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
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gt: now } }
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
        const banner = await PromoBanner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Promo banner not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Promo banner updated successfully",
            data: banner
        });
    } catch (error) {
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
        res.status(200).json({
            success: true,
            message: "Promo banner deleted successfully"
        });
    } catch (error) {
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
