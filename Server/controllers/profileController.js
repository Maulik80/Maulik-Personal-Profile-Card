import profileModel from '../models/profileModel.js'; // Ensure file is named 'profileModel.js'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// --- HELPER: Upload to Cloudinary & Clean Temp File ---
const uploadImageToCloudinary = async (filePath) => {
    try {
        const imageUpload = await cloudinary.uploader.upload(filePath, { resource_type: 'image' });
        return imageUpload.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Image upload failed");
    } finally {
        // ALWAYS delete the local file, success or fail
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// --- 1. CREATE PROFILE ---
export const createProfile = async (req, res) => {
    try {
        // ✅ FIX: Get userId from req.userId (Secure) instead of req.body
        const userId = req.userId; 
        const { name, age, city, bio, skills, email, phone } = req.body;
        const imageFile = req.file; 

        if (!userId) {
            return res.json({ success: false, message: "Authentication Failed: User ID missing" });
        }

        if (!name || !age || !city) {
            return res.json({ success: false, message: "Name, Age, and City are required." });
        }

        let photoUrl = "";

        if (imageFile) {
            photoUrl = await uploadImageToCloudinary(imageFile.path);
        }

        const newProfile = new profileModel({
            userId, name, age, city, bio, skills, email, phone,
            photo: photoUrl
        });

        await newProfile.save();
        return res.json({ success: true, message: "Profile Card Created Successfully" });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};

// --- 2. GET USER PROFILES (With Pagination) ---
export const getUserProfiles = async (req, res) => {
    try {
        const userId = req.userId; // ✅ FIX
        
        // Pagination Logic (Default: Page 1, 10 items)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const profiles = await profileModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await profileModel.countDocuments({ userId });

        return res.json({ 
            success: true, 
            profiles,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProfiles: total
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// --- 3. DELETE PROFILE ---
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId; 

        const profile = await profileModel.findOneAndDelete({ _id: id, userId });
        
        if (!profile) {
            // ✅ 404: Not Found (or 403 Forbidden effectively)
            return res.status(404).json({ success: false, message: "Profile not found or unauthorized" });
        }
        
        return res.status(200).json({ success: true, message: "Profile Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- 4. UPDATE PROFILE ---
export const updateProfile = async (req, res) => {
    try {
        const { id, name, age, city, bio, skills, email, phone } = req.body;
        const userId = req.userId; // ✅ FIX
        const imageFile = req.file;

        const profile = await profileModel.findOne({ _id: id, userId });
        if (!profile) return res.json({ success: false, message: "Profile not found" });

        // Update Text Fields
        profile.name = name || profile.name;
        profile.age = age || profile.age;
        profile.city = city || profile.city;
        profile.bio = bio || profile.bio;
        profile.skills = skills || profile.skills;
        profile.email = email || profile.email;
        profile.phone = phone || profile.phone;

        // Update Image ONLY if new one uploaded
        if (imageFile) {
            profile.photo = await uploadImageToCloudinary(imageFile.path);
        }

        await profile.save();
        return res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// --- 5. GET PUBLIC PROFILE (For Sharing) ---
export const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL URL/:id

        // Find and increment 'views' by 1
        const profile = await profileModel.findByIdAndUpdate(
            id, 
            { $inc: { views: 1 } }, 
            { new: true } // Return updated doc
        );

        if (!profile) {
            return res.json({ success: false, message: "Profile not found" });
        }

        return res.json({ success: true, profile });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};