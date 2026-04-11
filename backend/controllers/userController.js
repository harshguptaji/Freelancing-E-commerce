import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


// Generate token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.userRole
        }, 
        process.env.JWT_SECRET,
        { 
            expiresIn: "3d"
        }
    );
};

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

// User Login
export const userLogin = async(req,res) => {
    try {
        const {userEmail, userPassword} = req.body;

        if(!userEmail || !userPassword){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            })
        }

        const user = await User.findOne(userEmail).select("+userPassword");
        if(!user){
            return res.status(400).json({
                message: "This Email-id is not exist in the system.",
                success: false
            });
        }

        const checkPassword = await user.comparePassword(userPassword);

        const token = generateToken(user);
        
        // set cookies
        res.cookie("token", token,{
            httpOnly: true,
            secure: false, // develpment
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Login Successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
};

// All User
export const allUser = async(req,res) => {
    try {
        const users = await User.find().lean();

        return res.status(200).josn({
            message: "All Users",
            users,
            success: true
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
}

// User By Id-
export const userById = async(req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({
                message: "This user is not exist any more",
                success: false
            });
        };

        return res.status(200).josn({
            message: "User found",
            user,
            success: true
        })
    } catch (error) {
        console.log(`Error - ${error}`)
    }
};

// Login User Information
export const loginUserInfo = async(req,res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);

        if(!user){
            return res.status(400).json({
                message: "This user does not exist any more",
                success: false
            });
        }

        return res.status.json({
            message: "User Information",
            success: true,
            user
        });

    } catch (error) {
        console.log(`Error - ${error}`);
    }
}