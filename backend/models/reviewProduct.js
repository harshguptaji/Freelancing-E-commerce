import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        min: [1, "Minimum rating is 1"],
        max: [5, "Maximum rating is 5"],
        required: true
    },
    ratingDes: {
        type: String
    }
}, {timestamps});

const Review = mongoose.model("Review",reviewSchema);

export default Review;