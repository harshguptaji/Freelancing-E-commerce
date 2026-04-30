import express from "express";
import { createReview } from "../controllers/reviewController";
import { authorizeRoles, isAuthenthicated } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create",isAuthenthicated, createReview);

export default router;