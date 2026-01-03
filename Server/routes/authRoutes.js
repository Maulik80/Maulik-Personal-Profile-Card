// server/routes/authRoutes.js
const express = require('express');
const { register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword, isAuthenticated } = require('../controllers/authController');
const userAuth = require('../middleware/userAuth');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Verification Routes
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
// verifyEmail controller logic would go here if implemented

// Password Reset Routes (Phase 5)
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Check if user is authenticated
authRouter.get('/is-auth', userAuth, isAuthenticated); // Assuming you have this simple checker

module.exports = authRouter;