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
    if(this.isModified("userEmailOTP") || this.isModified("userMobileOTP")){
        this.userEmailOTP = await bcrypt.hash(this.userEmailOTP,10)
    }

    next();
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.userPassword);
}

const User = mongoose.model("User", userSchema);
export default User;