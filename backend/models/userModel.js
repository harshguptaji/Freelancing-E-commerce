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
        type: String
    },
    userEmailOTPExpiry:{
        type: Date
    },
    userMobileOTP:{
        type: String
    },
    userMobileOTPExpiry:{
        type: Date
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
        type: Date
    }
});


userSchema.pre("save", async function (next){
    if(!this.isModified("userPassword")) return next();

    this.userPassword = await bcrypt.hash(this.userPassword, 10);
    next();
})

const User = mongoose.model("User", userSchema);
export default User;