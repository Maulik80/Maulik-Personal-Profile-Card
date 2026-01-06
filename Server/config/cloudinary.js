/* Server/config/cloudinary.js */
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const connectCloudinary = async () => {
    // 1. Check for missing keys
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
        console.error("❌ Cloudinary Config Error: Missing Environment Variables");
        return; // Stop execution
    }

    try {
        // 2. Configure
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        console.log("✅ Cloudinary Connected"); // Succes Log
    } catch (error) {
        console.error("❌ Cloudinary Connection Failed:", error.message);
    }
}

export default connectCloudinary;