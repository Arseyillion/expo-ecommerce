import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        default:0,    
    },
    category:{
        type:String,
        required:true,
    },
    images:[{
        type:String,
        required:true,
    }],
    averageRating:{
        type:Number,
        min:0,
        max:5,
        default:0,  
    },
    totalReviews:{
        type:Number,
        default:0,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    discountedPrice: {
        type: Number,
        min: 0,
    },
    hasDiscount: {
        type: Boolean,
        default: false,
    },
},{timestamps:true})

// Pre-save middleware to calculate discounted price and hasDiscount flag
productSchema.pre('save', function(next) {
    if (this.discount > 0) {
        this.discountedPrice = this.price * (1 - this.discount / 100);
        this.hasDiscount = true;
    } else {
        this.discountedPrice = this.price;
        this.hasDiscount = false;
    }
    next();
});

// Pre-update middleware for updates
productSchema.pre(['findOneAndUpdate', 'updateOne'], function(next) {
    const update = this.getUpdate();
    if (update.discount !== undefined) {
        // We need to get the current document to access the price
        this.findOne().then(doc => {
            if (doc) {
                const price = update.price || doc.price;
                if (update.discount > 0) {
                    update.$set = update.$set || {};
                    update.$set.discountedPrice = price * (1 - update.discount / 100);
                    update.$set.hasDiscount = true;
                } else {
                    update.$set = update.$set || {};
                    update.$set.discountedPrice = price;
                    update.$set.hasDiscount = false;
                }
            }
            next();
        }).catch(err => next(err));
    } else {
        next();
    }
});

export const Product = mongoose.model("Product",productSchema);