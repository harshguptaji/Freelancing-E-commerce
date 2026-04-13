import dotenv from "dotenv";

dotenv.config({quiet:true});
import express from "express";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";

//Database connected
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// ALL Routes
app.use("/api/v1/user",userRoute);


const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT - ${PORT}`);
});

