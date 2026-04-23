import express from "express";
import { authorizeRoles, isAuthenthicated } from "../middlewares/authMiddleware.js";
import { allCategory, deleteCategory, registerCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/register", isAuthenthicated, authorizeRoles("Admin"), registerCategory);

router.get("/all", isAuthenthicated, authorizeRoles("Admin"), allCategory);

router.delete("/delete", isAuthenthicated, authorizeRoles("Admin"), deleteCategory);

export default router;