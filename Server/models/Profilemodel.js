import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, // ✅ Proper DB Link
        ref: 'user', // Reference to the 'user' model
        required: true 
    }, 
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true }, // ✅ Changed to Number
    city: { type: String, required: true, trim: true },
    bio: { type: String, default: '', trim: true },
    skills: { type: String, default: '', trim: true }, // Stored as "React, Node, CSS"
    email: { type: String, default: '', trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    photo: { type: String, default: '' }, // Stores Cloudinary URL
    views: { type: Number, default: 0 }
}, { timestamps: true });

const profileModel = mongoose.models.profile || mongoose.model('profile', profileSchema);
export default profileModel;