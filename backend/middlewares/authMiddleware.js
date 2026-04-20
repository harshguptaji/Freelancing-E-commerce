import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


// Login OR Not 
export const isAuthenthicated = async(req,res,next) => {
    const token = req.cookies.token;

    // Check Token
    if(!token){
        return res.status(401).josn({
            message: "Not Authenthicated",
            success: false
        });
    }
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch User
        const user = await User.findById(decoded.id).select("+passwordForgot");

        if(!user){
            return res.status(400).json({
                message: "User is no longer exist",
                success: false
            });
        }

        if(user.passwordForgot){
            const pwdChangeTime = Math.floor(
                user.passwordForgot.getTime() / 1000
            );

            if (decoded.iat < pwdChangeTime) {
                return res.status(401).json({
                    success: false,
                    message: "Password changed. Please login again."
                });
            };
        }

        req.user = {
            id : decoded.id,
            role: decoded.role
        }

        next();

    } catch (error) {
        console.log(`Error - ${error}`);
        return res.status(401).josn({
            message: "Not Aunthenthicated",
            success: false
        });
    }
};

// Role based Check
export const authorizeRoles = (...roles) => {
    try {
        return (req,res,next) => {
            if(!roles.includes(req.user.role)){
                return res.status(403).json({
                    message: "Access Denied, Contact Admin",
                    success: false
                });
            }
            next();
        };
    } catch (error) {
        console.log(`Error - ${error}`);
    };
};
