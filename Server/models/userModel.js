import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true // "User@Gmail.com" -> "user@gmail.com"
    },
    password: { 
        type: String, 
        required: true 
    },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
}, { timestamps: true }); // ✅ Added timestamps (createdAt, updatedAt)

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;