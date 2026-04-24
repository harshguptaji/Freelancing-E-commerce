import express from "express";
import upload from "../middlewares/upload.js";
import { registerProduct } from "../controllers/productController.js";
import { authorizeRoles, isAuthenthicated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create",isAuthenthicated, authorizeRoles("Admin"), (req,res)=>{
     upload.array("images", 5)(req, res, async (err) => {

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    
    await registerProduct(req, res);
  });
});

export default router;
