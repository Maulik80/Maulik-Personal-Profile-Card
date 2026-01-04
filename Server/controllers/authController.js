import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // Ensure this matches your folder name (Model vs models)
import transporter from '../config/nodemailer.js';

// --- 1. LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 2. REGISTER ---
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // Auto-login after register
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 3. LOGOUT ---
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 4. SEND VERIFICATION OTP ---
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body; // userId comes from userAuth middleware
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already Verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiry
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #0984e3;">Verify Your Account</h2>
                    <p>Hello ${user.name},</p>
                    <p>Your 6-digit verification code is:</p>
                    <h1 style="background: #f1f2f6; padding: 10px; text-align: center; letter-spacing: 5px; color: #2d3436;">${otp}</h1>
                    <p>This code will expire in 24 hours.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'Verification OTP Sent to Email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 5. VERIFY EMAIL OTP ---
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: 'Email Verified Successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 6. CHECK AUTHENTICATION STATUS ---
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 7. SEND PASSWORD RESET OTP ---
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ success: false, message: "Email is required" });

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 Minutes expiry
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #ff4d4f;">Reset Password Request</h2>
                    <p>Hello ${user.name},</p>
                    <p>Use the OTP below to reset your password:</p>
                    <h1 style="background: #fff0f0; padding: 10px; text-align: center; letter-spacing: 5px; color: #d63031;">${otp}</h1>
                    <p>This code expires in 15 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "Reset OTP sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- 8. RESET PASSWORD ---
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and New Password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}