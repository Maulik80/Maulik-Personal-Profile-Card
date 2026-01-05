import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Links card to the logged-in user
    name: { type: String, required: true },
    age: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String },
    skills: { type: String },
    email: { type: String },
    phone: { type: String },
    photo: { type: String }, // Stores Base64 image string
    views: { type: Number, default: 0 }
}, { timestamps: true });

const profileModel = mongoose.models.profile || mongoose.model('profile', profileSchema);
export default profileModel;