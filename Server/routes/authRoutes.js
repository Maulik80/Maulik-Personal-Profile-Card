/* Server/routes/authRoutes.js */
import express from 'express';
import { 
    register, login, logout, 
    sendVerifyOtp, verifyEmail, 
    isAuthenticated, 
    sendResetOtp, resetPassword 
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import { authLimiter, apiLimiter } from '../middleware/rateLimits.js'; // ✅ Import both

const authRouter = express.Router();

// 1. Strict Limiter (Login/Register) - 5 attempts/15min
authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);

// 2. Sensitive Actions (OTP/Reset) - Use General Limiter to prevent spam
authRouter.post('/send-verify-otp', userAuth, apiLimiter, sendVerifyOtp);
authRouter.post('/send-reset-otp', apiLimiter, sendResetOtp);
authRouter.post('/reset-password', apiLimiter, resetPassword);

// 3. Standard Routes
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);

export default authRouter;