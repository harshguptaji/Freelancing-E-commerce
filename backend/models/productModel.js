import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        minlength: [3, "Product Name must be more then 3 Character"],
        maxlength: [50, "Product Name must be less then 50 Character"],
        required: true,
        unique: true
    },
    productDes: {
        type: String,
        minlength: [3, "Product Decsription must be more then 3 Character"],
        maxlength:[200, "Product Name must be less then 200 Character"],
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number
    },
    productImages: [
        {
            publicId: String,
            url: String
        }
    ],
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    productStock: {
        type: Number,
        required: true
    },
    productDiscount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        max: [90, "Discount cannot exceed 90%"]
    },
    productAvgRating: {
        type: Number,
        default: 0
    },
    productTotalReviews: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

productSchema.pre("save", async function(next){
    if(this.isModified("productDiscount") || this.isModified("productPrice")){

        if(!this.productDiscount){
            this.finalPrice = this.productPrice;
        } else{
            const discountAmount = (this.productPrice * this.productDiscount) / 100;
            this.finalPrice = this.productPrice - discountAmount;
        }
        next();
    }
});

const Product = mongoose.model("Product",productSchema);

export default Product;