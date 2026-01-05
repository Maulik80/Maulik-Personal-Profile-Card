/* Server/config/cloudinary.js */
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'; // ખાતરી કરો કે .env લોડ થાય

const connectCloudinary = async () => {
    // 👇 Debugging Lines
    console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing");

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
}

export default connectCloudinary;