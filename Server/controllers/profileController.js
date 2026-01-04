// server/controllers/profileController.js
const profileModel = require('../models/Profilemodel'); // Ensure this matches your file name

// --- 1. CREATE PROFILE ---
exports.createProfile = async (req, res) => {
    try {
        const { userId, name, age, city, bio, skills, email, phone, photo } = req.body;

        if (!name || !age || !city) {
            return res.json({ success: false, message: "Name, Age, and City are required." });
        }

        const newProfile = new profileModel({
            userId, // Comes from userAuth middleware
            name,
            age,
            city,
            bio,
            skills,
            email,
            phone,
            photo
        });

        await newProfile.save();
        return res.json({ success: true, message: "Profile Card Created Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// --- 2. GET USER PROFILES ---
exports.getUserProfiles = async (req, res) => {
    try {
        const { userId } = req.body; // Comes from userAuth middleware
        const profiles = await profileModel.find({ userId }).sort({ createdAt: -1 }); // Newest first

        return res.json({ success: true, profiles });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// --- 3. DELETE PROFILE ---
exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.body; // Profile ID to delete (sent from frontend)
        const { userId } = req.body; // User ID from auth (security check)

        const profile = await profileModel.findOneAndDelete({ _id: id, userId });

        if (!profile) {
            return res.json({ success: false, message: "Profile not found or unauthorized" });
        }

        return res.json({ success: true, message: "Profile Deleted Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// --- 4. UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
    try {
        const { id, name, age, city, bio, skills, email, phone, photo, userId } = req.body;

        const updatedProfile = await profileModel.findOneAndUpdate(
            { _id: id, userId }, // Find by ID AND User (Security)
            { name, age, city, bio, skills, email, phone, photo },
            { new: true } // Return the updated document
        );

        if (!updatedProfile) {
            return res.json({ success: false, message: "Update Failed or Unauthorized" });
        }

        return res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};