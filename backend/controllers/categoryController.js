import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";


// Register Category
export const registerCategory = async(req,res) => {
    try {
        const {categotyName, categoryDes} = req.body;

        if(!cateoryName){
            return res.status(400).json({
                message: "Kindly fill Category Name field",
                success: false
            });
        }

        const checkCategory = await Category.findOne(categotyName);

        if(checkCategory){
            return res.status(400).json({
                message: "This Category is already register",
                success: false
            });
        }

        const category = await Category.create({
            categoryName,
            categoryDes
        });

        return res.status(200).json({
            message: `${categoryName} is register.`,
            success: true
        })

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// All Categories
export const allCategory = async(_,res) => {
    try {
        const category = await Category.find();

        return res.status(200).json({
            message: "All Category",
            category,
            success: false
        })
    } catch (error) {
        console.log(`Error - ${error}`);
    }
};


// Delete Category & update Product Category
export const deleteCategory = async(req,res) => {
    try {
        const {updateCategory} = req.body;

        const id = req.params.id;

        if(!updateCategory){
            return res.status(400).json({
                message: "PLease provide Catgory to change delete Category with this category in the products.",
                success: false
            });
        }

        const category = await Category.findOne({categoryName: updateCategory});
        if(!category){
            return res.status(400).json({
                message: "This category not found with us, please register with this category",
                success: false
            });
        }

        //Update Product Category
        const updateProducts = await Product.updateMany(
            {productCategory: id},
            {$set:{productCategory:updateCategory}}
        );

        const result = await Category.deleteOne({_id: id});
        if(result.deletedCount === 0){
            return res.status(400).json({
                message: "Category not found, please refresh",
                success: false
            });
        }

        return res.status(200).json({
            message: "Category Deleted, and product category updated",
            success: trye
        });


    } catch (error) {
        console.log(`Error - ${error}`);
    }
};