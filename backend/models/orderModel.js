import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name:{
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    subTotal: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0      
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Online", "COD"],
        required: true
    },
    gstPrice: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryPrice: {
        type: Number,
        required: true,
        default: 0
    },
    discountCode: {
        type: String,
        default: null
    },
    discountAmount: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Order = mongoose.model("Order",orderSchema);

export default Order;
