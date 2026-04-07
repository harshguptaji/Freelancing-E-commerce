import dotenv from "dotenv";

dotenv.config({quiet:true});
import express from "express";
import { connectDB } from "./db/db.js";
const app = express();

connectDB();
const PORT = process.env.PORT || 4000;


app.listen(PORT, ()=>{
    console.log(`Server is running on PORT - ${PORT}`);
});

