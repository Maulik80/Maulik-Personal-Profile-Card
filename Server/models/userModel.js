// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required: true,unique: true },
    password: {type: String,required: true},
    // --- Phase 3 & 4: Account Verification ---
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    // --- Phase 5: Password Reset (Future Proofing) ---
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    createdAt: {type: Date, default: Date.now}
});

// Use existing model if available to prevent overwrite errors
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);