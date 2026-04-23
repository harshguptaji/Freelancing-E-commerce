import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryDes: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;