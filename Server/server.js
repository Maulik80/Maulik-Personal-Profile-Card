import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'; // Auto-loads .env variables
import connectCloudinary from './config/cloudinary.js';

// Import Routes (Note the .js extension is required in ES Modules)
import authRouter from './routes/authRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
connectCloudinary();

// --- 1. Middleware Configuration ---
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse Cookies

// Configure CORS (Critical for Frontend-Backend communication)
// Ensure 'origin' matches your frontend URL in production
const allowedOrigins = [
    'http://localhost:5173', 
    process.env.FRONTEND_URL // Allow environment variable for production URL
].filter(Boolean);

app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true // Allow cookies to be sent/received
})); 

// --- 2. API Routes ---
app.get('/', (req, res) => {
    res.send("🚀 Maulik-Personal-Profile-Card API is running...");
});

app.use('/api/auth', authRouter);      // Auth: Login, Register, Verify
app.use('/api/user', userRouter);      // User: Get Data
app.use('/api/profiles', profileRouter); // Profiles: Create, Get, Update, Delete

// --- 3. Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
// Support both standard env variable names
const URI = process.env.MONGODB_URL || process.env.MONGODB_URI; 

if (!URI) {
    console.error("❌ Error: MONGODB_URL or MONGODB_URI environment variable is missing.");
    process.exit(1);
}

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