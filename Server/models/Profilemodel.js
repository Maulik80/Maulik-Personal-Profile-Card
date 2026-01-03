// server/Model/profileModel.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    // Phase 4: Reference to the User Model
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    bio: { type: String },
    skills: { type: String }, // Stored as comma-separated or converted to Array
    email: { type: String },
    phone: { type: String },
    photo: { type: String }, // Stores Base64 string for the image
    createdAt: { type: Date, default: Date.now }
});

const profileModel = mongoose.models.profile || mongoose.model('profile', profileSchema);
export default profileModel;