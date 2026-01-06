/* Server/controllers/authController.js */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // ✅ NEW: For Secure OTPs
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// --- Helper: Standard Cookie Options ---
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
};

// --- 1. REGISTER ---
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();

        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ 
            name, 
            email: normalizedEmail, 
            password: hashedPassword 
        });
        
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({ success: true, message: "Account Created Successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 2. LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({ success: true, message: "Logged In Successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 3. LOGOUT ---
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            ...COOKIE_OPTIONS,
            maxAge: 0 // Expire immediately
        });
        return res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 4. SEND VERIFICATION OTP ---
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account Already Verified" });
        }

        // ✅ Secure OTP Generation
        const otp = crypto.randomInt(100000, 999999).toString();

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4F46E5;">Verify Your Account</h2>
                    <p>Hello ${user.name}, use the code below to verify your email:</p>
                    <div style="background: #F3F4F6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
                        ${otp}
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">Valid for 24 hours.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Verification OTP Sent' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 5. VERIFY EMAIL OTP ---
export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.status(200).json({ success: true, message: 'Email Verified Successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 6. CHECK AUTH STATUS ---
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 7. SEND RESET OTP ---
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // ✅ Secure OTP Generation
        const otp = crypto.randomInt(100000, 999999).toString();

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 Minutes
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?email=${email}&otp=${otp}`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password Request',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #DC2626;">Reset Password</h2>
                    <p>Click the button below or use code <b>${otp}</b></p>
                    <a href="${resetLink}" style="display:inline-block; background:#DC2626; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">Reset Password</a>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">Expires in 10 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Reset Link sent to email" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// --- 8. RESET PASSWORD ---
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Missing input fields' });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}