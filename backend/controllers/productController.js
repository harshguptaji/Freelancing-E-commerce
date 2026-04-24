import Category from "../models/categoryModel";
import Product from "../models/productModel";


// Controller to register product and Image Upload Handling
export const registerProduct = async(req,res) => {
    try {
        const {productName, productDes, productPrice, productCategory, productStock} = req.body;

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
                const result = await uploadToCloudinary(file.buffer);
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
