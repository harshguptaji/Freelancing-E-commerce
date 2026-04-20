import express from "express";
import { allUser, forgotPassword, loginUserInfo, passwordChange, registerUser, sentOTP, updateLoginUserInfo, userById, userLogin, userLogout, userVerify } from "../controllers/userController.js";
import { authorizeRoles, isAuthenthicated } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);

router.post("/login",userLogin);

router.get("logout", userLogout);

router.get("/all",isAuthenthicated, authorizeRoles("Admin"), allUser);

router.get("profile", isAuthenthicated, loginUserInfo);

router.put("forgotpassword", isAuthenthicated, passwordChange);

router.post("verify",isAuthenthicated, userVerify);

router.get("get/otp", isAuthenthicated, sentOTP);

router.post("forgot-password", forgotPassword);

router.put("edit/:id", isAuthenthicated, updateLoginUserInfo);

router.get("/:id",isAuthenthicated, authorizeRoles("Admin"),userById);

export default router;