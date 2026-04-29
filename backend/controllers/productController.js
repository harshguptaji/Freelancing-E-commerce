import mongoose from "mongoose";
import { uploadCloundinary } from "../middlewares/upload";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// Controller to register product and Image Upload Handling
export const registerProduct = async(req,res) => {
    try {
        const {productName, productDes, productPrice, productCategory, productStock, productDiscount} = req.body;

        let uploadImages = [];

        if(!productName || !productDes || !productPrice || !productCategory || !productStock){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const checkCategory = await Category.findOne({categoryName: productCategory});

        if(!checkCategory){
            return res.status(400).json({
                message: "This Category not found with us",
                success: false
            });
        }

        const checkProduct = await Product.findOne(productName);
        if(checkProduct){
            return res.status(400).json({
                message: "This Product is already found with us",
                success: false
            })
        }

        // Validate Images
        if(!req.files || req.files.length !== 5){
            return res.status(400).json({
                message: "Exactly 5 Images required.",
                success: false
            });
        }

        // Upload Images In Parallel
        uploadImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadCloundinary(file.buffer);
                return {
                    publicId: result.public_id,
                    url: result.secure_url,
                };
            })
        );

        // create Product
        const product = await Product.create({
            productName,
            productDes,
            productPrice,
            productCategory: checkCategory._id,
            productStock,
            productDiscount,
            productImages: uploadImages
        });

        return res.status(200).json({
            message: "Product is created successfully",
            success: true
        });
        
    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// All Product
export const allProducts = async(req,res) => {
    try {

        let {page = 1, limit = 10} = req.query;

        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1)*limit;

        const products = await Product.find()
        .select("productName productDes finalPrice productImages productAvgRating")
        .sort({createdAt = -1})
        .skip(skip)
        .limit(limit)
        .lean();

        const totalProducts = await Product.countDocuments();

        return res.status(200).json({
            success: true,
            products,
            hasMore: skip + products.length < totalProducts
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
}

// Product By Id
export const productById = async(req,res) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id).populate({
            path: "productCategory",
            select: "categoryName"
        }).populate({
            path: "productReviews.userId",
            select: "userName"
        });
        
        if(!product){
            return res.status(400).json({
                message: "This Product is not exist any more",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product Details",
            product,
            success:true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// Edit Product By Id
export const editProduct = async(req,res) => {
    try {
        const id = req.params.id;
        // ✅ Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }
        const {productName, productDes, productPrice, productCategory, productStock, productDiscount} = req.body;

        const product = await Product.findById(id);

        if(!product){
            return res.status(400).json({
                message: "This product is not exist any more",
                success: false
            });
        }

        if(productName){
            const checkName = await Product.findOne({
                productName,
                _id: { $ne: id }
            });

            if(checkName){
                return res.status(200).json({
                    message: "This Name is already exist",
                    success: false
                });
            }
            product.productName = productName;
        }

        if(productDes){
            product.productDes = productDes;
        }

        if(productPrice !== undefined){
            product.productPrice = productPrice
        }

        if(productCategory){
            const checkCategory = await Category.findOne({categoryName: productCategory});
            if(!checkCategory){
                return res.status(400).json({
                    message: "This Category not exist.",
                    success: false
                });
            }
            product.productCategory = checkCategory._id;
        }

        if(productStock !== undefined){
            product.productStock = productStock;
        }

        if(productDiscount !== undefined){
            product.productDiscount = productDiscount;
        }

        await product.save();

        return res.status(200).json({
            message: "Product update successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// Update Images of a Product
export const updateImageProduct = async(req,res) => {
    try {
        const id = req.params.id;

        const {existingImages} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Kindly refresh your page",
                success: false
            });
        }

        const product = await Product.findById(id).select("productImages");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // =========================
        // 🔹 Parse existing images
        // =========================

        let keepImages = [];

        if (existingImages) {
            try {
                keepImages = JSON.parse(existingImages);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Invalid existingImages format"
                });
            }
        }

        // Step 1: count new uploads
        const newImagesCount = req.files ? req.files.length : 0;

        // Step 2: calculate final length BEFORE any delete
        const finalCount = keepImages.length + newImagesCount;

        if (finalCount > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images allowed"
            });
        }

        // =========================
        // 🔥 DELETE removed images
        // ==========================

        const imageToDelete = product.productImages.filter(
            oldImg => !keepImages.find(k => k.publicId === oldImg.publicId)
        )

        if (imagesToDelete.length > 0) {
            await Promise.all(
                imagesToDelete.map(img =>
                    cloudinary.uploader.destroy(img.publicId)
                )
            );
        }

        // =========================
        // 🔥 UPLOAD new images
        // =========================

        let newImages = [];

        newImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadCloundinary(file.buffer);
                return {
                    publicId: result.public_id,
                    url: result.secure_url,
                };
            })
        );

        // Final Images
        const finalImages = [...keepImages,...newImages];

        // save Images
        product.productImages = finalImages;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product images updated successfully",
            images: product.productImages
        });

    } catch (error) {
        console.log(`Error - ${error}`)
    }
};

// Delete Product
export const deleteProduct = async(req,res) => {
    try {
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Kindly refresh your page",
                success: false
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // ✅ Delete Images from Cloudinary
        if (product.productImages && product.productImages.length > 0) {
            await Promise.all(
                product.productImages.map(img =>
                    cloudinary.uploader.destroy(img.publicId)
                )
            );
        }

        // ToDo Delete Reviews

        return res.status(200).json({
            message: "Product Delete Successfully",
            success: true
        })
    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// Search and Filter of products
export const searchProduct = async(req,res) => {
    try {
        
    } catch (error) {
        console.log(`Error - ${error}`);
    }
}

