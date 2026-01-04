// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Fixed spelling
require('dotenv').config();

// Import Routes
const authRouter = require('./routes/authRoutes');
const profileRouter = require('./routes/profileRoutes'); // Phase 7: Profile Routes

const app = express();

// --- Middleware Configuration ---
app.use(express.json()); // 1. Parse JSON body
app.use(cookieParser()); // 2. Parse Cookies

// 3. Configure CORS (Critical for cookies to work)
app.use(cors({ 
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow sending cookies/tokens
})); 

// --- API Routes ---
app.get('/', (req, res) => res.send("🚀 Profile Manager API is running..."));
app.use('/api/auth', authRouter);      // Auth endpoints (Login/Register)
app.use('/api/profiles', profileRouter); // Profile endpoints (CRUD)

// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
    .then(() => {
        console.log("✅ MongoDB Connection Successful");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err.message);
    });