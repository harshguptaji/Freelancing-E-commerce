import multer, { memoryStorage } from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import sharp from "sharp";

// Allowed formats
const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// Multer Memory Storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 15*1024*1024 // 15MB Limit
    },
    fileFilter: (req,file,cb) => {
        if(allowedFormats.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error("Only JPEG, JPG, WEBP & PNG format allowed"), false);
        }
    },
});

// Upload + Validate Dimensions + Send to Cloudinary
export const uploadCloundinary = async(fileBuffer) => {
    try {
        // Check Width and Height using Sharp
        const metaData = await sharp(fileBuffer).metadata();

        const {width, height} = metaData;

        // validatin height and width
        if(width < 300 || height < 300){
            throw new Error("Image is too small (min 300x300)")
        }
        if (width > 2000 || height > 2000) {
            throw new Error("Image too large (max 2000x2000)");
        }

        // Resize Image
        const processedImage = await sharp(fileBuffer).resize(800,800,{
            fit:"inside"
        }).toBuffer;

        // Upload Image to cloudinary Stream
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    quality: "auto",
                    fetch_format: "auto",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(processedImage).pipe(stream);
        });
    } catch (error) {
        throw(error);
    }
};

export default upload;