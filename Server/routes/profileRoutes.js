/* Server/routes/profileRoutes.js */
import express from 'express';
import { 
    createProfile, getUserProfiles, 
    updateProfile, deleteProfile, 
    getPublicProfile 
} from '../controllers/profileController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/multer.js';
import { apiLimiter } from '../middleware/rateLimits.js'; // ✅ Security

const profileRouter = express.Router();

// 1. Public Route (Protected from Scraping Bots)
profileRouter.get('/public/:id', apiLimiter, getPublicProfile); 

// 2. User Actions (Protected from Spam Uploads)
profileRouter.post('/add', userAuth, apiLimiter, upload.single('photo'), createProfile);
profileRouter.post('/update', userAuth, apiLimiter, upload.single('photo'), updateProfile);

// 3. Read/Delete
profileRouter.get('/get-user-profiles', userAuth, getUserProfiles);
profileRouter.post('/delete', userAuth, deleteProfile);

export default profileRouter;