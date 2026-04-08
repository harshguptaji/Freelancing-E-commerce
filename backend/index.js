import dotenv from "dotenv";

dotenv.config({quiet:true});
import express from "express";
import { connectDB } from "./db/db.js";

//Database connected
connectDB();

const app = express();

// Middlewares


const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT - ${PORT}`);
});

