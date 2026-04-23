

export const registerProduct = async(req,res) => {
    try {
        const {productName, productDes, productPrice, productCategory, productStock} = req.body;

        if(!productName || !productDes || !productPrice || !productCategory || !productStock){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }
    } catch (error) {
        console.log(`Error - ${error}`);
    }
}