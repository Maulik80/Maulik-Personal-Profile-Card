import express from 'express';
import { createProfile, getUserProfiles, deleteProfile, updateProfile } from '../controllers/profileController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/multer.js'; // <--- Import Multer

const profileRouter = express.Router();

// Add 'upload.single' to intercept the 'photo' field
profileRouter.post('/add', userAuth, upload.single('photo'), createProfile);
profileRouter.post('/update', userAuth, upload.single('photo'), updateProfile);
profileRouter.get('/get-user-profiles', userAuth, getUserProfiles);
profileRouter.post('/delete', userAuth, deleteProfile);

export default profileRouter;