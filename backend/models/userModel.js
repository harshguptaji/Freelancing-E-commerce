import mongoose from "mongoose";
import bcrypt from "bcrypt";

// const otp = Math.floor(10000 + Math.random() * 900000);

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userMobile: {
        type: String,
        required: true,
        unique: true
    },
    userRole: {
        type: String,
        enum: ['Admin','User'],
        default: "User",
        required: true
    },
    userEmailOTP:{
        type: String,
        select: false
    },
    userOTPExpiry:{
        type: Date,
        select: false
    },
    userMobileOTP:{
        type: String,
        select: false
    },
    userVerified:{
        type: Boolean,
        required: true,
        default: false
    },
    userWishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    userAddToCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    userCreated: {
        type: Date,
        default: Date.now
    },
    passwordForgot: {
        type: Date,
        select: false
    }
});


userSchema.pre("save", async function (next){

    if(this.isModified("userPassword")){
        this.userPassword = await bcrypt.hash(this.userPassword, 10);
    } 
    if(this.isModified("userEmailOTP")){
        this.userEmailOTP = await bcrypt.hash(this.userEmailOTP,10)
    }
    if(this.isModified("userMobileOTP")){
        this.userMobileOTP = await bcrypt.hash(this.userMobileOTP,10)
    }

    next();
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.userPassword);
}

userSchema.methods.compareMobileOTP = async function(mobileOTP){
    return await bcrypt.compare(mobileOTP, this.userMobileOTP);
}

userSchema.methods.compareEmaileOTP = async function(emailOTP){
    return await bcrypt.compare(emailOTP, this.userEmailOTP);
}

const User = mongoose.model("User", userSchema);
export default User;