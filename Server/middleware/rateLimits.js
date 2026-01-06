/* Server/middleware/rateLimits.js */
import rateLimit from 'express-rate-limit';

// 1. Strict Limiter for Login/Register (5 attempts per 15 mins)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Increased slightly to 10 for better UX
    standardHeaders: true, 
    legacyHeaders: false,
    handler: (req, res) => {
        // ✅ Custom 429 Response
        res.status(429).json({
            success: false,
            message: "Too many login attempts. Please try again after 15 minutes."
        });
    }
});

// 2. General Limiter for other routes (100 attempts per 15 mins)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests, please slow down."
        });
    }
});