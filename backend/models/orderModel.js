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
            name: {
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

    subtotal: {
        type: Number,
        required: true,
        default: 0
    },

    gstPrice: {
        type: Number,
        default: 0
    },

    deliveryPrice: {
        type: Number,
        default: 0
    },

    discountCode: {
        type: String,
        default: null
    },

    discountAmount: {
        type: Number,
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

    paymentMethod: {
        type: String,
        enum: ["Online", "COD"],
        required: true
    },

    paymentInfo: {
        paymentId: {
            type: String,
            default: null
        },
        orderId: {
            type: String,
            default: null
        },
        signature: {
            type: String,
            default: null
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;