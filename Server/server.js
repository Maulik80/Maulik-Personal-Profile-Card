import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'; // Auto-loads .env variables

// Import Routes (Note the .js extension is required in ES Modules)
import authRouter from './routes/authRoutes.js';
import profileRouter from './routes/profileRoutes.js';

const app = express();

// --- 1. Middleware Configuration ---
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse Cookies

// Configure CORS (Critical for Frontend-Backend communication)
app.use(cors({ 
    origin: 'http://localhost:5173', // Must match your Vite Frontend URL
    credentials: true // Allow cookies to be sent/received
})); 

// --- 2. API Routes ---
// server/server.js
// ...
app.get('/', (req, res) => res.send("🚀 Maulik-Personal-Profile-Card API is running...")); 
// ...
app.use('/api/auth', authRouter);      // Auth: Login, Register, Verify
app.use('/api/profiles', profileRouter); // Profiles: Create, Get, Update, Delete

// --- 3. Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
// Note: Ensure your .env uses MONGODB_URL or update this to MONGODB_URI
const URI = process.env.MONGODB_URL || process.env.MONGODB_URI; 

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