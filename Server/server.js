import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'; 
import helmet from 'helmet'; // ✅ Security Headers
import morgan from 'morgan'; // ✅ Logger
import connectCloudinary from './config/cloudinary.js';

// Import Routes
import authRouter from './routes/authRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// --- 1. Configuration & Security ---
connectCloudinary();

// Secure HTTP Headers
app.use(helmet()); 

// HTTP Request Logger ('dev' gives colored logs)
app.use(morgan('dev')); 

// CORS Config
const allowedOrigins = [
    'http://localhost:5173', 
    process.env.FRONTEND_URL // Production URL
].filter(Boolean);

app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true 
})); 

// --- 2. Middleware ---
app.use(express.json()); 
app.use(cookieParser()); 

// --- 3. API Routes ---
app.get('/', (req, res) => {
    res.send("🚀 Maulik-Personal-Profile-Card API is running...");
});

app.use('/api/auth', authRouter);      
app.use('/api/user', userRouter);      
app.use('/api/profiles', profileRouter); 

// --- 4. Global Error Handler (Prevents Crashes) ---
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// --- 5. Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URL || process.env.MONGODB_URI; 

if (!URI) {
    console.error("❌ Error: MONGODB_URL is missing in .env");
    process.exit(1);
}

mongoose.connect(URI)
    .then(() => {
        console.log("✅ MongoDB Connection Successful");
        
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`);
        });

        // ✅ Graceful Shutdown (Properly closes DB on Ctrl+C)
        const shutdown = () => {
            server.close(() => {
                console.log('\n🛑 Server closed');
                mongoose.connection.close(false, () => {
                    console.log('🛑 MongoDB connection closed');
                    process.exit(0);
                });
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err.message);
    });