import User from "../models/userModel.js";


// User Registartion
export const registerUser = async(req,res) => {
    try {
        const {userName, userEmail, userMobile, userPassword} = req.body;

        // Check all fields
        if(!userName || !userEmail || !userMobile || !userPassword){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        // Check Dupliacates
        const checkUser = await User.findOne({
            $or: [
                {userEmail},{userMobile}
            ]
        }).select("_id");

        if(checkUser){
            return res.status(400).json({
                message: "Email or Password already register with us",
                sucess: false
            });
        }

        // Register user
        const user = await User.create({
            userName,
            userEmail,
            userMobile,
            userPassword
        });

        user.userPassword = undefined;

        return res.status(200).json({
            message: "User Register Successfully",
            user,
            success: true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};