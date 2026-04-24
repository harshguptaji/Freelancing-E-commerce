import { uploadCloundinary } from "../middlewares/upload";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

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
        const products = await Product.find();

        return res.status(200).json({
            message: "All Products",
            products,
            success: true
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
            path: "Category",
            select: "categoryName"
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
        const {productName, productDes, productPrice, productCategory, productStock, productDiscount} = req.body;

        const product = await Product.findById(id);

        if(!product){
            return res.status(400).json({
                message: "This product is not exist any more",
                success: false
            });
        }

        if(productName){
            const checkName = await Product.findOne(productName);

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

        if(productPrice){
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

        if(productStock){
            product.productStock = productStock;
        }

        if(productDiscount){
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
}