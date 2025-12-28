import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // The price field in orderItemSchema should have a minimum value constraint to prevent negative prices.
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image:{
        type: String,
        required: true
    }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});  

const orderSchema = new mongoose.Schema(
    {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    // removed unique constraint from clerkId to allow multiple orders per user..The clerkId field has a unique: true constraint, which will prevent users from placing multiple orders. A user should be able to create many orders, so this constraint will cause database errors on the second order from the same user.
    clerkId:{
        type: String,  
        required: true,
    },
    // The orderItems array should be marked as required and have a minimum length validation to prevent creating orders without any items.
    orderItems: {
        type:[orderItemSchema],
        required: true,
        validate:{
            validator:(items)=>items.length>0,
            message:"Order must have at least one item."
        }
    },
    shippingAddress: {
        type:shippingAddressSchema,
        required:true,
    },
    paymentResult:{
        id: String,
        status: String,
    },
    totalPrice: {
        type: Number,
        required: true,
        min:0,
    },
    status:{
        type: String,
        enum:["pending","processing","shipped","delivered","cancelled"],
        default:"pending",
    },
    deliveredAt: {
        type: Date,
    },
    shippedAt: {
        type: Date,
    },
}, { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);