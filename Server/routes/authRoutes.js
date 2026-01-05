import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import { authLimiter } from '../middleware/rateLimits.js'; // <--- Import

const authRouter = express.Router();

// Apply Strict Limiter ONLY to Login & Register
authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);

// Other routes can be normal
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;