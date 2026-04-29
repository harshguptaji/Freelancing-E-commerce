import mongoose from "mongoose";
import User from "../models/userModel.js";
import Product from "../models/productModel";
import Review from "../models/reviewProduct.js";

// Create and Update Review
export const createReview = async(req,res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const {rating, ratingDes} = req.body;

        // Check Id
        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({
                message: "PLease refresh",
                success: false
            });
        };

        const user = await User.findById(userId).select("_id");
        const product = await Product.findById(productId).select("_id");

        // Check User and Product
        if(!user || !product){
            return res.status(400).json({
                message: `User or Product not exist any more`,
                success: false
            });
        }

        // check the review is already exist or not
        const alreadyExist = await Review.findOne({
            userId: user._id,
            productId: product._id
        });

        if(alreadyExist){
            alreadyExist.rating = rating;
            if(ratingDes){
                alreadyExist.ratingDes = ratingDes;
            } 
            
            await alreadyExist.save();
        }else{
            const review = await Review.create({
                userId: user._id,
                productId: product._id,
                rating,
                ratingDes
            });
        }

        // Update Avg Rating of Prouct
        const stats = await Review.aggregate([
            {$match:{productId: new mongoose.Types.ObjectId(productId)}},
            {
                $group:{
                    _id:"$productId",
                    avgRating: {$avg: "$rating"},
                    numOfreviews: {$sum: 1}
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                avgRating: stats[0].avgRating,
                numOfReviews: stats[0].numOfReviews
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                avgRating: 0,
                numOfReviews: 0
            });
        }

        return res.status(200).json({
            message: alreadyExist ? "Review is updated": "Review is created successfully.",
            success: true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};